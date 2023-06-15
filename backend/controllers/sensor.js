const { models: { Sensor, Locals: Locals } } = require('../models');



module.exports = {
    createSensor: async (req, res) => {
        try {
          const {
            sensortype,
            model,
            frequencyPlan,
            devEUI,
            appEUI,
            appKey,
            sensorname,
            location,
            localId,
            description,
          } = req.body;

          const { id: userId } = req.user; // Obtém o userId do objeto req.user 

          let createdLocalId;

      if (localId === 'new') {
        // Cria um novo local
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
            sensortype,
            model,
            frequencyPlan,
            devEUI,
            appEUI,
            appKey,
            sensorname,
            location ,
            localId :createdLocalId ,
            description,
            userId, // Atribui o ID do usuário ao criar o sensor
          });
          
          return res.redirect('sensors');
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      },  

      //Metodo para ir buscar todos os sensores
      getAllSensors: async (req, res) => {
        try {
          const sensors = await Sensor.findAll();
          return sensors;
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      },

//Metodo para apagar os sensores
      deleteSensor: async (req, res) => {
    try {
      const {
        id } = req.body;
      await Sensor.destroy({
        where: { id: id }
      })
      return res.status(200).json({ message: 'deleted' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error when trying to delete' });
    }
  },

  //buscar os locais
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
      const userId = req.user.id; // Obtém o ID do usuário logado

      const sensors = await Sensor.findAll({
        where: { userId }, // Filtra pelos sensores associados ao usuário logado
      });

      return sensors;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

}