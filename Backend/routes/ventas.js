const express = require('express');
const router = express.Router();
const { obtenerVentas, crearVenta } = require('../controllers/ventas');

// Ruta para obtener todas las ventas
router.get('/', obtenerVentas);

// Ruta para crear una nueva venta
router.post('/', crearVenta);

module.exports = router;
