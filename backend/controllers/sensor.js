const db = require('../models');
const { models: { Sensor,Locals: Locals, SensorData, User} } = require('../models');
const axios = require('axios');

// Função excluir o dispositivo da TTN
const deleteSensorTTN = async (id, devEUI) => {
  try {
    const appID = 'projeto-2022-test';
    const ttnAPIUrl = `https://eu1.cloud.thethings.network/api/v3/applications/${appID}/devices/${id}`;

    const headers = {
      'Authorization': 'Bearer NNSXS.VBDNJAKZMO3PJCOUKZBSMMMQKXDNZJ2JIDAT25Q.LZL37FNTTUJURDKSYK4EM5I4O5AUPYKIZGM3R2I32BYEQLUS6HHA'
    };

    await axios.delete(ttnAPIUrl, { headers });

    console.log('Device deleted from TTN');
  } catch (error) {
    throw new Error('Error deleting device from TTN:', error);
  }
};


module.exports = {
  createSensor: async (req, res) => {
    try {
      const {
        devEUI,
        appKey,
        sensorname,
        latitude,
        longitude,
        localId,
        description,
      } = req.body;


      //validação do nome do sensor
    const validSensorname = sensorname.toLowerCase();

      const { id: userId } = req.user;

      let createdLocalId;

      if (localId === 'new') {
        const { newLocal, newLocalDescription } = req.body;

        const newLocalObj = await Locals.create({
          localName: newLocal,
          localDescription: newLocalDescription,
          userId: userId,
        });

        createdLocalId = newLocalObj.id;
      } else {
        createdLocalId = localId;
      }

      const newSensor = await Sensor.create({
        model: 'Arduino MKR WAN 1310',
        devEUI,
        appKey,
        sensorname:validSensorname,
        latitude,
        longitude,
        localId: createdLocalId,
        userId,
        description,
      });

     
      // Registro do dispositivo na TTN
      try {
        const appID = 'projeto-2022-test'; // Substitua <app-id> pelo ID da sua aplicação na TTN
        const ttnAPIUrl = `https://eu1.cloud.thethings.network/api/v3/applications/${appID}/devices`;

        const ttnPayload = {
          "end_device": {
            "ids": {
              "device_id": validSensorname,
              "dev_eui": devEUI,
              "join_eui": "0000000000000000"
            },
            "lorawan_version": "1.0.0",
            "supports_join": true,
            "frequency_plan_id": "EU_863_870",
            "root_keys": {
              "app_key": {
                "key": appKey
              }
            },
            "routing_profile_id": "AS923",
            "application_server_address": "eu1.cloud.thethings.network",
            "network_server_address": "eu1.cloud.thethings.network",
            "join_server_address": "eu1.cloud.thethings.network"
          }
        };
        

const headers = {
  'Authorization': 'Bearer NNSXS.VBDNJAKZMO3PJCOUKZBSMMMQKXDNZJ2JIDAT25Q.LZL37FNTTUJURDKSYK4EM5I4O5AUPYKIZGM3R2I32BYEQLUS6HHA'
};

        await axios.post(ttnAPIUrl, ttnPayload ,{ headers });

        console.log('Device registered on TTN');
      } catch (error) {
        console.error('Error registering device on TTN:', error);
      }

       
      return res.redirect('sensors');
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getAllSensors: async (req, res) => {
    try {
      const sensors = await Sensor.findAll();
      return sensors;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  deleteSensor: async (req, res) => {
    try {
      const { id } = req.body;
  
      // Antes de excluir o sensor, vamos buscar as readings associadas a ele
    const sensor = await Sensor.findOne({ where: { id } });
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }
     
      const readings = await SensorData.findAll({ where: { sensorname: sensor.sensorname } });
  
      // Agora, para cada reading, vamos excluí-la
      for (const reading of readings) {
        await reading.destroy();
      }
  
      // Excluir da TTN
      try {
        const sensor = await Sensor.findOne({ where: { id } });
  
        await deleteSensorTTN(sensor.sensorname, sensor.devEUI);
  
        console.log('Device deleted from TTN');
      } catch (error) {
        console.error('Error deleting device from TTN:', error);
      }
  
      // Por fim, excluímos o sensor da base de dados
      await Sensor.destroy({ where: { id } });
  
      console.log('Device deleted from the database');
  
      return res.status(200).json({ message: 'deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error when trying to delete' });
    }
  },

  getLocals: async (req, res) => {
    try {
      const locals = await Locals.findAll();
      return locals;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error when trying to get locals' });
    }
  },

  getUserSensors: async (req, res) => {
    try {
      const userId = req.user.id;

      const sensors = await Sensor.findAll({
        where: { userId },
       
      });

      return sensors;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  //EDITAR SENSORES

  renderEditSensorPage: async (req, res) => {
    try {
      const { sensorname } = req.params;
      const sensor = await Sensor.findOne({where: {sensorname}});
      const locals = await Locals.findAll();
  
      res.render('editsensor', { sensor, locals });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  editSensor: async (req, res) => {
    try {
      
      const { sensorname } = req.params;
      const {
        devEUI,
        appKey,
        newSensorname,
        location,
        localId,
        description,
        newLocal,
        newLocalDescription,
      } = req.body;
      
      console.log('Original Sensor Name:', sensorname);
      console.log('New Sensor Name:', newSensorname);

      // Verifique se o novo nome do sensor já está em uso
      if (newSensorname && newSensorname !== sensorname) {
        const existingSensor = await Sensor.findOne({ where: { sensorname: newSensorname } });
        if (existingSensor) {
          return res.status(400).json({ message: 'Sensor name already in use' });
        }
      }

      // Atualize as informações do sensor no banco de dados
    const sensor = await Sensor.findOne({ where: { sensorname } });

    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    sensor.devEUI = devEUI;
    sensor.appKey = appKey;
    sensor.sensorname = newSensorname; // Use o novo nome do sensor se fornecido, caso contrário, mantenha o nome original
    sensor.location = location;
    sensor.description = description;
    sensor.localId = localId === 'new' ? null : localId;

    if (localId === 'new') {
      // Crie um novo local se for fornecido
      const newLocalObj = await Locals.create({
        localName: newLocal,
        description: newLocalDescription,
        userId: sensor.userId,
      });
      sensor.localId = newLocalObj.id;
    }

    await sensor.save();

    // Atualize as informações do dispositivo na TTN
    try {
      const appID = 'projeto-2022-test';
      const ttnAPIUrl = `https://eu1.cloud.thethings.network/api/v3/applications/${appID}/devices/${sensorname}`;

      const headers = {
        'Authorization': 'Bearer NNSXS.VBDNJAKZMO3PJCOUKZBSMMMQKXDNZJ2JIDAT25Q.LZL37FNTTUJURDKSYK4EM5I4O5AUPYKIZGM3R2I32BYEQLUS6HHA',
      };

      const ttnDeviceResponse = await axios.get(ttnAPIUrl, { headers });
      const ttnDevice = ttnDeviceResponse.data;

      const ttnUpdatePayload = {
        ...ttnDevice,
        "end_device": {
          ...ttnDevice.end_device,
          "ids": {
            "device_id": sensorname, // Usar o sensorname original como ID do dispositivo na TTN
            "dev_eui": sensor.devEUI,
            "join_eui": "0000000000000000"
          },
          "lorawan_version": "1.0.0",
          "supports_join": true,
          "frequency_plan_id": "EU_863_870",
          "root_keys": {
            "app_key": {
              "key": sensor.appKey
            }
          },
          "routing_profile_id": "AS923",
          "application_server_address": "eu1.cloud.thethings.network",
          "network_server_address": "eu1.cloud.thethings.network",
          "join_server_address": "eu1.cloud.thethings.network"
        }
      };

      await axios.put(ttnAPIUrl, ttnUpdatePayload, { headers });

      console.log('Device updated on TTN');
    } catch (error) {
      console.error('Error updating device on TTN:', error);
    }


      return res.redirect('/sensors');
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  showSensorGraphs: async (req, res) => {
    try {
      const { sensorname } = req.params;
  
      // Obtenha as leituras do sensor com base no sensorname
      const readings = await db.models.SensorData.findAll({
        where: { sensorname },
        order: [['createdAt', 'ASC']] // Ordenar as leituras por data de criação
      });
  
      // Separe as leituras de temperatura e umidade em dois arrays diferentes
      const temperatures = readings.map(reading => ({
        temperature: reading.temperature,
        createdAt: reading.createdAt
      }));
      const humidities = readings.map(reading => ({
        humidity: reading.humidity,
        createdAt: reading.createdAt
      }));
  
      // Renderize a página graphs.hbs passando as leituras de temperatura e umidade
      return res.render('graphs', { sensorname, temperatures: JSON.stringify(temperatures), humidities: JSON.stringify(humidities) });
    } catch (error) {
      console.error('Error fetching sensor readings:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  
};