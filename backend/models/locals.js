module.exports = (sequelize, DataTypes) => {
  const Locals = sequelize.define('local', {
      localName: DataTypes.STRING,
      localDescription: DataTypes.STRING,
      userId: DataTypes.INTEGER, 
  }, {
      freezeTableName: true // Não pluralizar o nome da tabela
  });

  Locals.associate = (models) => {
      Locals.hasMany(models.Sensor, {
          foreignKey: 'localId',
          as: 'sensors'
      });

      Locals.belongsTo(models.User, 
        { foreignKey: 'userId', 
        as: 'user' 
    });
  };

  return Locals;
};
