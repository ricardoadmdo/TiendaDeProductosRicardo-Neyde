const { response, request } = require('express');
const Venta = require('../models/venta');

const obtenerVentas = async (req = request, res = response) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	try {
		const totalVentas = await Venta.countDocuments();
		const totalPages = Math.ceil(totalVentas / limit);
		const ventas = await Venta.find().skip(skip).limit(limit);

		res.json({
			ventas,
			currentPage: page,
			totalPages,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al obtener las ventas' });
	}
};

const obtenerVentaPorId = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const venta = await Venta.findById(id);

		if (!venta) {
			return res.status(404).json({ mensaje: 'Venta no encontrada' });
		}

		res.json(venta);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al obtener la venta' });
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
	obtenerVentaPorId,
	crearVenta,
	actualizarVenta,
	eliminarVenta,
};
