const bcrypt = require('bcrypt');

const saltRounds = 10;

// Função para criar um hash da senha
const hashPasswordSync = (password) => {
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Erro ao criar o hash da senha');
  }
};

module.exports = {
  hashPasswordSync,
};
