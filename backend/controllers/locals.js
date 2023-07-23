
const { models : { Locals, Sensor, SensorData }} = require('../models');
const { deleteSensorTTN } = require('../utils/ttnUtils');
const axios = require('axios');

module.exports = {
    createLocal: async (req, res) => {
        try {
          const {
            localName,
            localDescription,
          } = req.body;

          const userId = req.user.id;
    
          const newLocal = await Locals.create({
            localName,
            localDescription,
            userId
            
          });
          
          return res.redirect('locals');
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      }, 

      getAllLocals: async (userId) => {
        try {
          const locals = await Locals.findAll({ where: { userId } });
          return locals;
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      },

      renderEditLocalPage: async (req, res) => {
        try {
          const {id } = req.params;
          const local = await Locals.findOne({where: {id}});
         
          res.render('editlocal', {local });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      },

      editLocal: async (req, res) => {
        try {
          const { id } = req.params;
          const { localName, localDescription } = req.body;
      
          await Locals.update(
            { localName, localDescription },
            { where: { id } }
          );
      
          return res.redirect('/locals');
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      },
      
      deleteLocal: async (req, res) => {
        try {
          const { id } = req.body;
      
          // Busque todos os sensores associados a esse local
          const sensors = await Sensor.findAll({ where: { localId: id } });
      
          // Para cada sensor encontrado, exclua-o da TTN usando a função deleteSensorTTN
          for (const sensor of sensors) {
            await deleteSensorTTN(sensor.sensorname, sensor.devEUI);
          }
      
          // Exclua todas as readings associadas a esses sensores
          await SensorData.destroy({ where: { sensorname: sensors.map(sensor => sensor.sensorname) } });
      
          // Exclua todos os sensores associados a esse local
          await Sensor.destroy({ where: { localId: id } });
      
          // Exclua o local do banco de dados
          await Locals.destroy({ where: { id: id } });
      
          return res.status(200).json({ message: 'deleted' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error when trying to delete' });
        }
      },
    
    }