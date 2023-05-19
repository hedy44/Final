
const { models : { Locals }} = require('../models');

module.exports = {
    createLocal: async (req, res) => {
        try {
          const {
            localName,
            localDescription,
          } = req.body;
    
          const newLocal = await Locals.create({
            localName,
            localDescription,
            
          });
          
          return res.redirect('locals');
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      }, 

      getAllLocals: async (req, res) => {
        try {
          const locals = await Locals.findAll();
          return locals;
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      },

      deleteLocal: async (req, res) => {
        try {
          const {
            id } = req.body;
          await Locals.destroy({
            where: { id: id }
          })
          return res.status(200).json({ message: 'deleted' });
    
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error when trying to delete' });
        }
      },
    
    }