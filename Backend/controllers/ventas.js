const Venta = require('../models/Venta');

// Controlador para obtener todas las ventas
const obtenerVentas = async (req, res) => {
	try {
		const ventas = await Venta.find();
		res.json(ventas);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al obtener las ventas' });
	}
};

// Controlador para crear una nueva venta
const crearVenta = async (req, res) => {
	try {
		const nuevaVenta = new Venta(req.body);
		await nuevaVenta.save();
		res.json({ mensaje: 'Venta creada exitosamente' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al crear la venta' });
	}
};

module.exports = {
	obtenerVentas,
	crearVenta,
};
