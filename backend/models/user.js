module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
      email: DataTypes.STRING,
      
      password: DataTypes.STRING
  }, {
      freezeTableName: true // Não pluralizar o nome da tabela
  });

  User.associate = (models) => {
      User.hasMany(models.Sensor, {
          foreignKey: 'userId',
          as: 'sensors'
      });
  };

  return User;
};