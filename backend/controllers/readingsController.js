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

module.exports = readingsController;