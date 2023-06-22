const express = require('express');
const router = express.Router();
const { sensor } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth');

router.get('/', async (req, res) => {
    try {
      const locals = await sensor.getLocals();
      res.render('addsensor', { locals });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



router.post('/', authMiddleware, sensor.createSensor);
router.delete('/',authMiddleware,  sensor.deleteSensor);


module.exports = router;