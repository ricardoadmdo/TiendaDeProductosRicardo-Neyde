const { Router } = require('express');
const { googleLocation } = require('../controllers/location');
const router = Router();

router.get('/get-country', googleLocation);

module.exports = router;
