const jwt = require('jsonwebtoken');
const { models : { User }} = require('../models'); //db.models.User = require('./user')(sequelize, Sequelize.DataTypes) do index do model


 module.exports = {
     create: async (req,res) => {
        const { email, password } = req.body;

        try {
          // Check if user with email already exists
          const existingUser = await User.findOne({ 
            where: {email} });

          if (existingUser) {
            return res.render("register", {
                msg: "Email ID already Taken",
                msg_type: "error",
              });
          }
          // Create a new user
          const newUser = await User.create({ email, password });

          // Generate JWT token
          const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
           // Set the token as a cookie
          res.cookie('jwt', token, { secure: true });

          res.render('login');
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
 },

    login: async (req,res) => {
      
      if (req.body.email && req.body.password) {
        const { email, password } = req.body;
  
        let user = await User.findOne({ where: { email, password } });
  
        if (user) {
          // Generate token
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
          // Set the token as a cookie
          res.cookie('jwt', token, { httpOnly: true });
  
          res.render('profile', { email });
        } else {
          res.render('login',{
            msg: "Email or password don't match ",
            msg_type: "error",
          });
        }
      }
        
}
  
}