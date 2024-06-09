const { response, request } = require('express');
const Venta = require('../models/venta');

const obtenerVentas = async (req, res) => {
	const { limit = 8, page = 1, fecha } = req.query;
	const skip = (page - 1) * limit;

	// Convertir la fecha a un objeto Date
	const fechaActual = new Date(fecha);

	// Establecer el fin del día actual (23:59:59.999)
	const endOfDay = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), 23, 59, 59, 999);

	try {
		const [ventas, total] = await Promise.all([
			Venta.find({
				fecha: { $gte: fechaActual, $lte: endOfDay },
			})
				.skip(Number(skip))
				.limit(Number(limit)),
			Venta.countDocuments({
				fecha: { $gte: fechaActual, $lte: endOfDay },
			}),
		]);

		res.json({
			total,
			ventas,
			page: Number(page),
			limit: Number(limit),
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		console.error('Error al obtener ventas:', error);
		res.status(500).json({
			msg: 'Error al obtener ventas',
			error: error.message,
		});
	}
};

const crearVenta = async (req = request, res = response) => {
	try {
		const productos = req.body.productos;
		const totalProductos = productos.reduce((acc, prod) => acc + prod.cantidad, 0);
		const precioTotal = productos.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0);

		const nuevaVenta = new Venta({
			productos: productos,
			totalProductos: totalProductos,
			precioTotal: precioTotal,
		});

		await nuevaVenta.save();
		res.json({ mensaje: 'Venta creada exitosamente', venta: nuevaVenta });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al crear la venta' });
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
