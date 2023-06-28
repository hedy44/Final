const express = require('express');
const router = express.Router();
const readingsController = require('../../controllers/readingsController');

router.get('/:sensorname', readingsController.getSensorReadings);

module.exports = router;
