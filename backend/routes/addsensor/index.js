const express = require('express');
const router = express.Router();
const { sensor, locals } = require('../../controllers'); // Importar também o controlador 'local'
const authMiddleware = require('../../middlewares/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userLocals = await locals.getAllLocals(req.user.id); // Buscar apenas os locais do usuário logado
    res.render('addsensor', { locals: userLocals }); // Renomear a variável para "userLocals"
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', authMiddleware, sensor.createSensor);
router.delete('/', authMiddleware, sensor.deleteSensor);

module.exports = router;
