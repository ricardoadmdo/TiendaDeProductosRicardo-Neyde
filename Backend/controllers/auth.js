const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const googleLogin = async (req = request, res = response) => {
	const { access_token } = req.body;

	try {
		// Obtener información del usuario desde Google
		const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
				Accept: 'application/json',
			},
		});

		const profile = response.data;

		// Verificar si el usuario ya existe en la base de datos
		let usuario = await Usuario.findOne({ correo: profile.email });

		if (!usuario) {
			// Crear un nuevo usuario si no existe
			usuario = new Usuario({
				nombre: profile.name,
				correo: profile.email,
				rol: 'USER_ROLE',
				estado: true,
				password: profile.email,
				google: true,
			});
			await usuario.save();
		}
		// Generar un token JWT
		const token = jwt.sign({ uid: usuario._id }, 'your_jwt_secret', {
			expiresIn: '1h',
		});

		res.json({
			msg: 'Login successful',
			usuario,
			token,
		});
	} catch (error) {
		console.error('Error during Google login:', error);
		res.status(500).json({
			msg: 'Error during Google login',
			error: error.message,
		});
	}
};

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
	googleLogin,
};
