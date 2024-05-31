const { Router } = require('express');
const { check } = require('express-validator');
const { login, register, googleLogin, createPassword, emailVerification, codeVerification } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post(
	'/login',
	[check('correo', 'El correo es obligatorio').isEmail(), check('password', 'La contraseña es obligatoria').not().isEmpty(), validarCampos],
	login
);
router.post(
	'/register',
	[check('correo', 'El correo es obligatorio').isEmail(), check('password', 'La contraseña es obligatoria').not().isEmpty(), validarCampos],
	register
);

router.post('/google', googleLogin);
router.post('/create-password', createPassword);
router.post('/login/:email/code', emailVerification);
router.post('/login/:email', codeVerification);

module.exports = router;
