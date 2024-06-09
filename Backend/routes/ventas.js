const { Router } = require('express');
const { obtenerVentas, obtenerVentaPorId, crearVenta, actualizarVenta, eliminarVenta } = require('../controllers/ventas');
const router = Router();

router.get('/', obtenerVentas);
router.get('/:id', obtenerVentaPorId);
router.post('/', crearVenta);
router.put('/:id', actualizarVenta);
router.delete('/:id', eliminarVenta);

module.exports = router;
