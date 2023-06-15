const mqtt = require('mqtt');
const io = require('socket.io')(4000);

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

client.on('connect', function() {
    console.log('Client connected to TTN');
    // client.subscribe('0000000000000000' + '/devices/+/up');
    client.subscribe('#');
  });

  let temperature; 
  let humidity;

  client.on('message', function(topic, message) {
    const msg = JSON.parse(message);
    const deviceId = msg.end_device_ids.device_id;
    const payloadFields = msg.uplink_message.decoded_payload;

    if (payloadFields.temp_c) {
        const temperature = payloadFields.temp_c;
        console.log('Temperature:', temperature);
        // Faça o que desejar com a temperatura recebida, como salvar em um banco de dados ou processá-la de alguma forma.
      }
    
    if (payloadFields.humidity) {
        const humidity = payloadFields.humidity;
        console.log('Humidity:', humidity);
        // Faça o que desejar com a umidade recebida, como salvar em um banco de dados ou processá-la de alguma forma.
      }

      // Emita os dados para o cliente conectado via socket.io
  io.emit('temperature', temperature);
  io.emit('humidity', humidity);
});

io.on('connection', function(socket) {
  console.log('Client connected: ' + socket.id);

  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected');
  });
});
    

client.on('error', function (error) {
  console.error('Erro na conexão MQTT:', error);
});

// Exporte o objeto do cliente MQTT
module.exports = client;