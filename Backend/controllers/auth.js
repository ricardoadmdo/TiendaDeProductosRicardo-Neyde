const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const transporter = require('../helpers/mailer.js');
const { v4: uuidv4 } = require('uuid');

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

		if (usuario.password === 'TEMPORAL') {
			return res.json({
				msg: 'Necesita crear una contraseña',
				cambiarPassword: true,
			});
		}

		if (!usuario) {
			// Crear un nuevo usuario si no existe
			usuario = new Usuario({
				nombre: profile.name,
				correo: profile.email,
				rol: 'USER_ROLE',
				estado: true,
				password: 'TEMPORAL',
				google: true,
			});
			await usuario.save();

			// Indicar que el usuario es nuevo
			const token = jwt.sign({ uid: usuario._id }, 'your_jwt_secret', {
				expiresIn: '1h',
			});

			return res.json({
				msg: 'New user, password creation required',
				newUser: true,
				usuario,
				token,
			});
		}

		// Generar un token JWT
		const token = jwt.sign({ uid: usuario._id }, 'your_jwt_secret', {
			expiresIn: '1h',
		});

		res.json({
			msg: 'Login successful',
			newUser: false,
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

const createPassword = async (req, res) => {
	const { correo, password } = req.body;

	try {
		let usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			return res.status(404).json({
				msg: 'User not found',
			});
		}

		// Hash de la contraseña
		const salt = bcryptjs.genSaltSync();
		usuario.password = bcryptjs.hashSync(password, salt);
		await usuario.save();

		// Generar un nuevo token JWT
		const token = jwt.sign({ uid: usuario._id }, 'your_jwt_secret', {
			expiresIn: '1h',
		});

		res.json({
			msg: 'Contraseña creada correctamente',
			usuario,
			token,
		});
	} catch (error) {
		console.error('Error during password creation:', error);
		res.status(500).json({
			msg: 'Error during password creation',
			error: error.message,
		});
	}
};

const login = async (req, res = response) => {
	const { correo, password } = req.body;

	try {
		if (password === 'TEMPORAL') {
			return res.status(400).json({
				msg: 'Necesita crear una contraseña',
			});
		}

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

	try {
		let usuario = await Usuario.findOne({ correo });

		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'El correo ya está registrado',
			});
		}

		usuario = new Usuario({ nombre, correo, password, rol });

		// Encriptar contraseña
		const salt = bcryptjs.genSaltSync();
		usuario.password = bcryptjs.hashSync(password, salt);

		await usuario.save();

		res.status(201).json({
			ok: true,
			msg: 'Usuario registrado correctamente',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs',
		});
	}
};

const emailVerification = async (req, res) => {
	const { email } = req.params;

	try {
		const usuario = await Usuario.findOne({ correo: email });

		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'No existe un usuario con ese correo',
			});
		}

		let code = '';
		for (let index = 0; index < 6; index++) {
			code += Math.floor(Math.random() * 10);
		}

		const verificationToken = uuidv4(); // Generar un token único

		usuario.login_code = code;
		usuario.verification_token = verificationToken;
		usuario.estado = false; // Asegúrate de actualizar el estado aquí
		await usuario.save();

		await transporter.sendMail({
			from: `Tienda Ricardo & Neyde ${process.env.EMAIL}`,
			to: email,
			subject: 'Código de inicio de sesión: ',
			text: 'Este es tu código para iniciar tu sesión:' + code,
		});

		res.status(200).json({ ok: true, token: verificationToken, msg: 'Código enviado con éxito' });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs',
			error,
		});
	}
};

const codeVerification = async (req, res) => {
	const { token, code } = req.body;

	try {
		const usuario = await Usuario.findOne({ verification_token: token, login_code: code });

		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Credenciales inválidas',
			});
		}

		// Actualizar el estado del usuario a true
		usuario.estado = true;
		usuario.verification_token = null; // Opcional: limpiar el token una vez verificado
		await usuario.save();

		// Aquí puedes añadir lógica adicional para iniciar sesión, generar tokens, etc.
		res.status(200).json({ ok: true, msg: 'Inicio de sesión exitoso.' });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs',
			error,
		});
	}
};

module.exports = {
	login,
	register,
	googleLogin,
	createPassword,
	emailVerification,
	codeVerification,
};
