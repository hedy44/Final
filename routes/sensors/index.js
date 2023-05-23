const express = require('express');
const router = express.Router();
const { sensor } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth.js');

router.get('/',authMiddleware, async (req, res) => {
    try {
      const sensors = await sensor.getAllSensors();
      res.render('sensors', { sensors });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Rota para buscar os locais
router.get('/locals', sensor.getLocals);





module.exports = router;