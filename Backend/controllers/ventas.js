const { response, request } = require('express');
const Venta = require('../models/venta');

const obtenerVentas = async (req, res) => {
	try {
		const { limit = 8, page = 1, fechas } = req.query;
		const skip = (page - 1) * limit;

		let filtro = {};
		if (fechas) {
			// Convertir la cadena de fechas en un array
			const fechasArray = Array.isArray(fechas) ? fechas : fechas.split(',');

			// Crear un array para almacenar los rangos de fechas
			const rangosFechas = fechasArray.map((fecha) => {
				// Asegurarse de que la fecha esté en el formato correcto
				const fechaConsulta = new Date(`${fecha}T00:00:00Z`);
				if (isNaN(fechaConsulta)) {
					throw new Error(`Invalid date format: ${fecha}`);
				}

				const fechaFin = new Date(fechaConsulta);
				fechaFin.setUTCHours(23, 59, 59, 999);

				return {
					fecha: {
						$gte: fechaConsulta.toISOString(),
						$lt: fechaFin.toISOString(),
					},
				};
			});

			// Usar $or a nivel de la consulta principal para buscar documentos que coincidan con cualquiera de los rangos de fechas
			filtro = { $or: rangosFechas };
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
		res.status(500).json({ message: `Error al obtener ventas: ${error.message}` });
	}
};

const crearVenta = async (req, res) => {
	try {
		const { ...datos } = req.body;

		// Verifica que los campos requeridos estén presentes
		if (!datos) {
			return res.status(400).json({ message: 'Campos requeridos faltantes' });
		}

		// Crear un nuevo objeto Venta con los datos recibidos
		const nuevaVenta = new Venta(datos);

		// Guardar la nueva venta en la base de datos
		await nuevaVenta.save();

		res.status(201).json(nuevaVenta); // Responder con la venta creada
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
