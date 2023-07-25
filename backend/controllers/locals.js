
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

           // Verifique se o localName contém apenas letras (maiúsculas ou minúsculas)
           const lettersRegex = /^[A-Za-z]+$/;
           if (!lettersRegex.test(localName)) {
             return res.render('addlocal', { msg: 'Apenas letras são permitidas no nome do local', msg_type: 'error' });
           }

      // Transforme a primeira letra do localName e localDescription em maiúscula
      const formattedLocalName = localName.charAt(0).toUpperCase() + localName.slice(1);
      const formattedLocalDescription = localDescription.charAt(0).toUpperCase() + localDescription.slice(1);

    
          const newLocal = await Locals.create({
            localName:formattedLocalName,
            localDescription:formattedLocalDescription,
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
      
          // Verifique se o localName e localDescription contêm apenas letras (maiúsculas ou minúsculas)
          const lettersRegex = /^[A-Za-z]+$/;
          if (!lettersRegex.test(localName)) {
            const local = await Locals.findOne({ where: { id } });
            return res.render('editlocal', { local, msg: 'Apenas letras são permitidas no nome do local', msg_type: 'error' });
          }

          if (!lettersRegex.test(localDescription)) {
            const local = await Locals.findOne({ where: { id } });
            return res.render('editlocal', { local, msg: 'Apenas letras são permitidas na descrição do local', msg_type: 'error' });
          }

          // Transforme a primeira letra do localName e localDescription em maiúscula
      const formattedLocalName = localName.charAt(0).toUpperCase() + localName.slice(1);
      const formattedLocalDescription = localDescription.charAt(0).toUpperCase() + localDescription.slice(1);

          await Locals.update(
            { localName:formattedLocalName, localDescription:formattedLocalDescription },
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