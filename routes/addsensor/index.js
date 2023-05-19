const express = require('express');
const router = express.Router();
const { sensor } = require('../../controllers');

router.get('/', (req, res) => {
    
    res.render('addsensor');
});

router.post('/', sensor.createSensor);
router.delete('/', sensor.deleteSensor);


module.exports = router;