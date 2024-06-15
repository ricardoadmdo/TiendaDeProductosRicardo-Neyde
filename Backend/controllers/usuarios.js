const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
	const { limit = 8, page = 1 } = req.query; // Valores por defecto: 8 combos por página y página 1
	const skip = (page - 1) * limit;

	try {
		const [usuarios, total] = await Promise.all([
			Usuario.find().populate('nombre').skip(Number(skip)).limit(Number(limit)),
			Usuario.countDocuments(),
		]);

		res.json({
			total,
			usuarios,
			page: Number(page),
			limit: Number(limit),
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error al obtener combos',
			error,
		});
	}
};

const usuariosBuscar = async (req = request, res = response) => {
	const { query } = req.query;

	if (!query) {
		return res.status(400).json({
			msg: 'Debe proporcionar un término de búsqueda',
		});
	}

	try {
		const usuarios = await Usuario.find({
			nombre: { $regex: query, $options: 'i' },
		}).populate('nombre');

		res.json({
			total: usuarios.length,
			usuarios,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error al buscar usuarios',
			error,
		});
	}
};

const usuariosPost = async (req, res) => {
	try {
		const { nombre, password, correo, rol } = req.body;
		const usuario = new Usuario({ nombre, password, correo, rol, estado: true });
		//Encriptar el password
		const salt = bcryptjs.genSaltSync();
		usuario.password = bcryptjs.hashSync(password, salt);

		//Guardar en BDb
		await usuario.save();

		res.json({
			usuario,
		});
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({
				msg: error,
				msg: 'Error Code =' + error.code,
			});
		}
	}
};

const usuariosPut = async (req, res) => {
	const { id } = req.params;
	const { ...dataToUpdate } = req.body;

	const usuario = await Usuario.findByIdAndUpdate(id, dataToUpdate);
	res.json(usuario);
};

const usuariosDelete = async (req, res) => {
	try {
		const { id } = req.params;

		// Primero, intenta encontrar el usuario con el estado en true
		const usuario = await Usuario.findOne({ _id: id, estado: true });

		if (!usuario) {
			return res.status(404).json({ msg: 'Usuario no encontrado o ya fue eliminado' });
		}

		const usuarioEliminado = await Usuario.findByIdAndDelete(id);

		// Enviar respuesta con los detalles del usuario eliminado
		return res.json({ msg: 'Usuario eliminado', usuario: usuarioEliminado });
	} catch (error) {
		// Manejar errores y enviar una respuesta con el error
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};

const usuarioChangeName = async (req, res = response) => {
	const { nombre } = req.body;
	const { id: usuarioId } = req.params;

	try {
		const usuario = await Usuario.findById(usuarioId);
		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Usuario no existe por ese id',
			});
		}
		const nuevoUsuario = {
			nombre,
		};

		const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, nuevoUsuario, {
			new: true,
		});

		res.json({
			ok: true,
			usuario: usuarioActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador',
		});
	}
};

module.exports = {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuarioChangeName,
	usuariosBuscar,
};
