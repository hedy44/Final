const { models : { Sensor }} = require('../models');

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
            description,
          } = req.body;
    
          const newSensor = await Sensor.create({
            sensortype,
            model,
            frequencyPlan,
            devEUI,
            appEUI,
            appKey,
            sensorname,
            location,
            description,
          });
          
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

}