const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {
	const { correo, password } = req.body;

	try {
		// Si el usuario existe por CORREO en la base de datos
		const usuario = await Usuario.findOne({ correo });
		if (!usuario) {
			return res.status(400).json({
				msg: 'Usuario o password incorrectos - correo',
			});
		}
		// Si el usuario está activo en la BD
		if (!usuario.estado) {
			return res.status(400).json({
				msg: 'El usuario no está activo en la BD - estado',
			});
		}

		// Verificar PASSWORD
		const validPassword = bcryptjs.compareSync(password, usuario.password, usuario.rol);

		if (!validPassword) {
			return res.status(400).json({
				msg: 'Usuario o password incorrectos - password',
			});
		}

		// Generar el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.error('Error en login:', error);
		return res.status(500).json({
			msg: 'Hable con el administrador',
		});
	}
};

const register = async (req, res = response) => {
	const { nombre, correo, password, rol } = req.body;

	// Crear un nuevo usuario con el código de verificación
	const usuario = new Usuario({ nombre, correo, password, rol });

	try {
		const salt = bcryptjs.genSaltSync();
		usuario.password = bcryptjs.hashSync(password, salt);

		// Guardar el usuario en la base de datos
		await usuario.save();

		res.json({
			usuario,
			msg: 'Registrado correctamente.',
		});
	} catch (error) {
		console.error('Error en registro:', error);
		return res.status(500).json({
			msg: 'Hable con el administrador',
		});
	}
};

module.exports = {
	login,
	register,
};
