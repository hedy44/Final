const db = require('../models');

const readingsController = {};

readingsController.saveReading = async (temperature, humidity, sensorname) => {
  try {
    // Pesquisar o sensor com base no sensorname (device_id)
    
    const sensor = await db.models.Sensor.findOne({
      where: { sensorname }
    });

    if (sensor) {
      // Obter o userId associado ao sensor encontrado
      const userId = sensor.userId;

      // Salvar os dados no banco de dados usando o modelo SensorData e o userId obtido
      await db.models.SensorData.create({
        temperature,
        humidity,
        sensorname,
        userId
      });

      console.log('Leitura do sensor salva com sucesso.');
    } else {
      console.log('Sensor não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao salvar leitura do sensor:', error);
  }
};


readingsController.getSensorReadings = async (req, res) => {
  
    const sensorname = req.params.sensorname;
    console.log('Valor de sensorname:', sensorname);//LOg prar teste
    // Obtenha as informações do sensor com base no sensorname
    const sensor = await db.models.Sensor.findOne({
      where: { sensorname },
    });

    if (sensor) {
      // Obtenha as leituras do sensor com base no sensorname
      const readings = await db.models.SensorData.findAll({
        where: { sensorname },
      });

      // Renderize a página sensorsread.hbs passando as informações do sensor e as leituras
      return res.render('sensorsread', { sensor, readings });
    } else if (sensor === null) {
      console.log('Sensor não encontrado.');
      return res.status(404).json({ message: 'Sensor não encontrado' });
    } else {
      console.log('Erro ao buscar sensor:', sensor);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

readingsController.getTemperatureRange = async (req, res) => {
  try {
    const sensorname = req.params.sensorname;

    // Obtenha a temperatura máxima e mínima do sensor com base no sensorname
    const temperatures = await db.models.SensorData.findAll({
      where: { sensorname },
      attributes: [
        [db.sequelize.fn('max', db.sequelize.col('temperature')), 'maxTemperature'],
        [db.sequelize.fn('min', db.sequelize.col('temperature')), 'minTemperature']
      ]
    });

    if (temperatures.length > 0) {
      const maxTemperature = temperatures[0].dataValues.maxTemperature;
      const minTemperature = temperatures[0].dataValues.minTemperature;

      // Renderize a página logged.hbs passando as temperaturas máxima e mínima
      return res.render('logged', { email: req.user.email, maxTemperature, minTemperature });
    } else {
      console.log('Temperaturas não encontradas.');
      return res.status(404).json({ message: 'Temperaturas não encontradas' });
    }
  } catch (error) {
    console.error('Erro ao buscar temperaturas:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};



module.exports = readingsController;