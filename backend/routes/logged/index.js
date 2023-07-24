const express = require('express');
const router = express.Router();
const { sensor } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth.js');

router.get('/', authMiddleware, async (req, res) => {
  try {
    // Obtenha os dados dos sensores do banco de dados usando o controller
    const userSensors = await sensor.getUserSensors(req, res);

    // Renderize a página "logged.hbs" passando os dados dos sensores e o email do usuário
    res.render('logged', { email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, sensors: userSensors });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;