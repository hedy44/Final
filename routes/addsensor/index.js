const express = require('express');
const router = express.Router();
const { sensor } = require('../../controllers');

// router.get('/', (req, res) => {
    
//     res.render('addsensor');
// });

router.get('/', async (req, res) => {
    try {
      const locals = await sensor.getLocals();
      res.render('addsensor', { locals });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



router.post('/', sensor.createSensor);
router.delete('/', sensor.deleteSensor);


module.exports = router;