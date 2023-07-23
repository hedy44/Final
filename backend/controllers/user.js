const jwt = require('jsonwebtoken');
const { models: { User } } = require('../models');

module.exports = {
  create: async (req, res) => {
    const { email, password, username, firstName, lastName, age, gender } = req.body;

    try {
      // Verificar se o usuário com o email já existe
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.render("register", {
          msg: "Email ID already taken",
          msg_type: "error",
        });
      }

      // Definir a foto de acordo com o gênero selecionado
      let photo = '';
      if (gender === 'male') {
        photo = 'male_avatar.png';
      } else if (gender === 'female') {
        photo = 'female_avatar.png';
      }

      // Criar um novo usuário
      const newUser = await User.create({ email, password, username, firstName, lastName, age, gender });

      // Gerar o token JWT
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Definir o token como um cookie
      res.cookie('jwt', token, { secure: true });

      res.render('login');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  login: async (req, res) => {
    if (req.body.email && req.body.password) {
      const { email, password } = req.body;

      try {
        const user = await User.findOne({ where: { email, password } });

        if (user) {

          req.user = {};

          req.user.email = user.email;
        req.user.gender = user.gender;
        req.user.username = user.username;
        req.user.firstName = user.firstName;
        req.user.lastName = user.lastName;
        req.user.age = user.age;
          // Gerar token
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

          // Definir o token como um cookie
          res.cookie('jwt', token, { httpOnly: true });

          res.render('profile', { email: user.email,
                                  gender: user.gender,
                                  username: user.username,
                                  firstName: user.firstName,
                                  lastName: user.lastName,
                                  age: user.age });
        } else {
          res.render('login', {
            msg: "Email or password don't match",
            msg_type: "error",
          });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    }
  }
};
