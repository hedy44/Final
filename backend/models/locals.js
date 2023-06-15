module.exports = (sequelize, DataTypes) => {
  const Locals = sequelize.define('local', {
      localName: DataTypes.STRING,
      localDescription: DataTypes.STRING
  }, {
      freezeTableName: true // Não pluralizar o nome da tabela
  });

  Locals.associate = (models) => {
      Locals.hasMany(models.Sensor, {
          foreignKey: 'localId',
          as: 'sensors'
      });
  };

  return Locals;
};
