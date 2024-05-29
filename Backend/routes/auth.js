const { Router } = require('express');
const { check } = require('express-validator');
const { login, register } = require('../controllers/auth');
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

module.exports = router;
