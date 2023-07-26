const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { hashPasswordSync } = require('../../utils/bcrypt');
const { models: { User } } = require('../../models');

// Rota para exibir a lista de users
router.get('/', async (req, res) => {
  try {
    // vai encontrar todos os users na BD
    const users = await User.findAll({
      where: {
        email: {
          [Op.not]: 'admin@admin.com'
        }
      }
    });
    res.render('users', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Rota para editar um user
router.get('/edit/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    //  user com o ID especificado na BD
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

    // Verificar se o usuário é administrador (por exemplo, com base no email)
    const isAdmin = user.email === 'admin@admin.com';

    // página de edição do usuário, passando os dados do usuário e isAdmin para o formulário
    res.render('editUser', { user, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Rota para excluir um usuário
router.get('/delete/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Vai buscar user id
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

    const isAdmin = user.email === 'admin@admin.com';

    // apaga user da BD
    await user.destroy();

    // volta para a lista de usuários após apagar
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const { email, password, username, firstName, lastName, age, gender } = req.body;
  
    try {
      // Buscar o usuário com o ID especificado no banco de dados
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send('Usuário não encontrado');
      }
  
      // Atualizar os dados do usuário com os valores enviados pelo formulário
      user.email = email;
      user.username = username;
      user.firstName = firstName;
      user.lastName = lastName;
      user.age = age;
      user.gender = gender;
  
      // Verificar se a senha foi alterada e, se sim, atualizar o hash da senha
      if (password) {
        const hashedPassword = hashPasswordSync(password);
        user.password = hashedPassword;
      }
  
      // Salvar as alterações no banco de dados
      await user.save();
  
      // Redirecionar para a lista de usuários após a atualização
      res.redirect('/users');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
