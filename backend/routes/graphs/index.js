const express = require('express');
const router = express.Router();
const { user } = require('../../controllers');
const { sensor } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth.js');

router.get('/',authMiddleware, (req, res) => {
    
    res.render('graphs');
});

router.get('/:sensorname', sensor.showSensorGraphs);

module.exports = router;