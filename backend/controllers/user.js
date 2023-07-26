const jwt = require('jsonwebtoken');
const { models: { User } } = require('../models');
const { hashPasswordSync } = require('../utils/bcrypt');
const bcrypt = require('bcrypt');

// Função para formatar a primeira letra de uma string para maiúscula
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  create: async (req, res) => {
    const { email, password, username, firstName, lastName, age, gender } = req.body;

 // Formatando o primeiro e último nome para que a primeira letra seja maiúscula
 const formattedFirstName = capitalizeFirstLetter(firstName.trim());
 const formattedLastName = capitalizeFirstLetter(lastName.trim());

     // Expressões regulares para validar o formato dos campos
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     const nameRegex = /^[a-zA-Z]+$/;
     const ageRegex = /^[0-9]{2}$/;

     // Verificar se o email está em branco ou não está no formato correto
     if (!email || (email.trim() !== '' && !emailRegex.test(email))) {
       return res.render("register", {
         msg: "O email inserido não é válido.",
         msg_type: "error",
       });
     }
 
     if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
       return res.render("register", {
         msg: "O Primeiro e Último nome devem conter apenas letras.",
         msg_type: "error",
       });
     }
 
     if (!ageRegex.test(age) || age < 18 || age > 90) {
       return res.render("register", {
         msg: "A idade deve ser um número entre 18 e 90.",
         msg_type: "error",
       });
     }

    try {
      // Criar o hash da senha usando o utilitário bcrypt
      const hashedPassword = hashPasswordSync(password);
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
      const newUser = await User.create({ 
        email, 
        password:hashedPassword, 
        username, 
        firstName: formattedFirstName, 
        lastName: formattedLastName, 
        age, 
        gender });

      // Gerar o token JWT
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Definir o token como um cookie
      res.cookie('jwt', token, { secure: true });

      res.render('login',  
      {msg: "Registo efectuado com sucesso",
      msg_type: "good"});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  login: async (req, res) => {
    if (req.body.email && req.body.password) {
      const { email, password } = req.body;

      try {
        const user = await User.findOne({ where: { email } });

        if (user) {
          // Comparar a senha fornecida com o hash armazenado usando bcrypt.compareSync
          if (bcrypt.compareSync(password, user.password)) {
            // Verificar se o usuário que fez login é o administrador
            const isAdmin = user.email === 'admin@admin.com';
            // Se a senha corresponder, gerar o token JWT e redirecionar para a página de perfil
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('jwt', token, { httpOnly: true });

            res.render('profile', {
              email: user.email,
              gender: user.gender,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              age: user.age,
              isAdmin
            });
          } else {
            // Se a senha não corresponder, mostrar uma mensagem de erro
            res.render('login', {
              msg: "A senha inserida está incorreta",
              msg_type: "error",
            });
          }
        } else {
          // Se o usuário não for encontrado, mostrar uma mensagem de erro
          res.render('login', {
            msg: "Email ou senha incorretos",
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
