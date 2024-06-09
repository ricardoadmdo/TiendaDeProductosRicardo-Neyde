const { response, request } = require('express');
const Producto = require('../models/producto');

const productosGet = async (req, res) => {
	const { limit = 8, page = 1, search } = req.query; // Valores por defecto: 10 productos por página y página 1
	const skip = (page - 1) * limit;

	// Construir la consulta para buscar productos donde el estado es true y el nombre coincide con el término de búsqueda
	const query = { estado: true };
	if (search) {
		query.nombre = { $regex: search, $options: 'i' }; // El operador $regex permite realizar búsquedas por expresiones regulares, 'i' ignora mayúsculas y minúsculas
	}

	// Buscar productos que coincidan con los criterios de búsqueda
	const [productos, total] = await Promise.all([
		Producto.find(query).populate('nombre').skip(Number(skip)).limit(Number(limit)),
		Producto.countDocuments(query),
	]);

	res.json({
		total,
		productos,
		page: Number(page),
		limit: Number(limit),
		totalPages: Math.ceil(total / limit),
	});
};

const productosBuscar = async (req = request, res = response) => {
	const { query } = req.query;

	if (!query) {
		return res.status(400).json({
			msg: 'Debe proporcionar un término de búsqueda',
		});
	}

	try {
		const productos = await Producto.find({
			nombre: { $regex: query, $options: 'i' },
			estado: true,
		}).populate('nombre');

		res.json({
			total: productos.length,
			productos,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error al buscar productos',
			error,
		});
	}
};

const productosPut = async (req, res) => {
	const { ...resto } = req.body;
	const { id } = req.params;

	const producto = await Producto.findByIdAndUpdate(id, resto);

	res.json(producto);
};

const productosPost = async (req, res) => {
	const { nombre, cantidad, precio, url } = req.body;
	const producto = new Producto({ nombre, cantidad, precio, url, estado: true });

	//Guardar en BD
	await producto.save();

	res.json({
		producto,
	});
};

const productoDelete = async (req, res) => {
	const { id } = req.params;

	// Primero, intenta encontrar el producto con el estado en true
	const producto = await Producto.findOne({ _id: id, estado: true });

	// Si el producto con estado true no se encuentra, enviar un mensaje de error
	if (!producto) {
		return res.status(404).json({ msg: 'Producto no encontrado o ya fue eliminado' });
	}

	// Si el producto existe y su estado es true, entonces cambia el estado a false
	const productoEliminado = await Producto.findByIdAndUpdate(id, { estado: false });

	res.json({ msg: 'Producto eliminado: ', producto: productoEliminado });
};

module.exports = {
	productosGet,
	productosPut,
	productosPost,
	productoDelete,
	productosBuscar,
};
