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



module.exports = readingsController;