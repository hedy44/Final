const { models: { Sensor, Locals: Locals } } = require('../models');
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
        location,
        localId,
        description,
      } = req.body;

      const { id: userId } = req.user;

      let createdLocalId;

      if (localId === 'new') {
        const { newLocal, newLocalDescription } = req.body;

        const newLocalObj = await Locals.create({
          localName: newLocal,
          description: newLocalDescription,
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
        sensorname,
        location,
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
              "device_id": sensorname,
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

      // Excluir da TTN
      try {
        const sensor = await Sensor.findOne({ where: { id } });

        await deleteSensorTTN(sensor.sensorname, sensor.devEUI);

        console.log('Device deleted from TTN');
      } catch (error) {
        console.error('Error deleting device from TTN:', error);
      }

      // Excluir do banco de dados
      try {
        await Sensor.destroy({ where: { id } });

        console.log('Device deleted from the database');
      } catch (error) {
        console.error('Error deleting device from the database:', error);
      }

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
};