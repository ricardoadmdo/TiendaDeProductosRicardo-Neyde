const { response, request } = require('express');
const Venta = require('../models/venta');
const venta = require('../models/venta');

const obtenerVentas = async (req, res) => {
	try {
		const { limit = 8, page = 1, fechas } = req.query;
		const skip = (page - 1) * limit;

		let filtro = {};
		if (fechas) {
			// Convertir la fecha recibida a un objeto Date
			const fechaConsulta = new Date(fechas);

			// Ajustar la fecha para que sea el comienzo del día
			fechaConsulta.setUTCHours(0, 0, 0, 0);

			// Calcular la fecha de fin del día
			const fechaFin = new Date(fechaConsulta);
			fechaFin.setUTCHours(23, 59, 59, 999);

			// Aplicar el filtro de fecha
			filtro.fecha = {
				$gte: fechaConsulta.toISOString(),
				$lt: fechaFin.toISOString(),
			};
		}

		const [ventas, total] = await Promise.all([Venta.find(filtro).skip(Number(skip)).limit(Number(limit)), Venta.countDocuments(filtro)]);

		res.json({
			total,
			ventas,
			page: Number(page),
			limit: Number(limit),
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		console.error('Error al obtener ventas:', error.message);
		res.status(500).json({ message: 'Error al obtener ventas' });
	}
};

const crearVenta = async (req, res) => {
	try {
		const { fecha, precioTotal, totalProductos, productos, otrosDatos } = req.body;

		// Verifica que los campos requeridos estén presentes
		if (!fecha || !precioTotal || !totalProductos || !productos) {
			return res.status(400).json({ message: 'Campos requeridos faltantes' });
		}

		// Verifica que la fecha sea válida
		const fechaValida = new Date(fecha);
		if (isNaN(fechaValida)) {
			return res.status(400).json({ message: 'Fecha inválida' });
		}

		// Aquí guardas los productos en la base de datos si es necesario
		// Por ejemplo, si tienes un modelo de Producto y una relación con el modelo Venta,
		// puedes guardar los productos de la venta en la base de datos aquí.

		const nuevaVenta = new Venta({ fecha: fechaValida, precioTotal, totalProductos, productos, ...otrosDatos });
		await nuevaVenta.save();
		res.status(201).json(nuevaVenta);
	} catch (error) {
		console.error('Error al crear venta:', error.message);
		res.status(500).json({ message: 'Error al crear venta' });
	}
};

const actualizarVenta = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const productos = req.body.productos;
		const totalProductos = productos.reduce((acc, prod) => acc + prod.cantidad, 0);
		const precioTotal = productos.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0);

		const ventaActualizada = await Venta.findByIdAndUpdate(
			id,
			{
				productos: productos,
				totalProductos: totalProductos,
				precioTotal: precioTotal,
			},
			{ new: true }
		);

		if (!ventaActualizada) {
			return res.status(404).json({ mensaje: 'Venta no encontrada' });
		}

		res.json({ mensaje: 'Venta actualizada exitosamente', venta: ventaActualizada });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al actualizar la venta' });
	}
};

const eliminarVenta = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const ventaEliminada = await Venta.findByIdAndDelete(id);

		if (!ventaEliminada) {
			return res.status(404).json({ mensaje: 'Venta no encontrada' });
		}

		res.json({ mensaje: 'Venta eliminada exitosamente' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al eliminar la venta' });
	}
};

module.exports = {
	obtenerVentas,
	crearVenta,
	actualizarVenta,
	eliminarVenta,
};
