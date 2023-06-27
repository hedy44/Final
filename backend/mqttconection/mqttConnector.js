const mqtt = require('mqtt');
const io = require('socket.io')(4000);
const db = require('../models');
const Sensor = db.models.Sensor;
const readingsController = require('../controllers/readingsController');



const options = {
  port: 1883,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'projeto-2022-test@ttn', // Substitua pelo seu username
  password: 'NNSXS.VBDNJAKZMO3PJCOUKZBSMMMQKXDNZJ2JIDAT25Q.LZL37FNTTUJURDKSYK4EM5I4O5AUPYKIZGM3R2I32BYEQLUS6HHA', // Substitua pela sua API Key
  keepalive: 60,
  reconnectPeriod: 1000,
  clean: true,
  encoding: 'utf8'
};

const client = mqtt.connect('mqtt://eu1.cloud.thethings.network:1883', options);

client.on('connect', function () {
  console.log('Client connected to TTN');
  client.subscribe('#');
});

client.on('message', async function (topic, message) {
  await handleMessage(topic, message);
});

async function handleMessage(topic, message) {
  const msg = JSON.parse(message);
  const payloadFields = msg.uplink_message.decoded_payload;

  let temperature = null;
  let humidity = null;
  let userId = null;

  if (payloadFields.temp_c) {
    temperature = payloadFields.temp_c;
    console.log('Temperature:', temperature);
  }

  if (payloadFields.humidity) {
    humidity = payloadFields.humidity;
    console.log('Humidity:', humidity);
  }

  // 1. Extrair o device_id do payload
    const device_id = msg.end_device_ids.device_id;;
    console.log('Device ID:', device_id);

    // 2. Encontrar o sensor com base no device_id
try {
  const sensor = await Sensor.findOne({ where: { sensorname: device_id } });
  if (sensor) {
    userId = sensor.userId;
  } else {
    throw new Error('Sensor not found');
  }
} catch (error) {
  console.error('Error retrieving sensor:', error);
  return;
}
  // 3. Crie um objeto com as informações da leitura
  const sensorDataPayload = {
    temperature,
    humidity,
    sensorId: device_id,
    userId
  };

  // 4. Salvar a leitura utilizando o controlador readingsController
  try {
    await readingsController.saveReading(sensorDataPayload.temperature, sensorDataPayload.humidity, sensorDataPayload.sensorId);
  } catch (error) {
    console.error('Error saving sensor data:', error);
    return;
  }
  // 5. Emita os eventos para o cliente
  io.emit('temperature', temperature);
  io.emit('humidity', humidity);
}

io.on('connection', function (socket) {
  console.log('Client connected: ' + socket.id);

  socket.on('disconnect', function () {
    console.log(socket.id + ' disconnected');
  });
});

client.on('error', function (error) {
  console.error('MQTT connection error:', error);
});

module.exports = client;
