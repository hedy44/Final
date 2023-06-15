module.exports = (sequelize, DataTypes) => {
  const Sensor = sequelize.define('Sensor', {
      sensortype: {
          type: DataTypes.ENUM('Temp Sensor', 'Hum Sensor', 'Img Sensor'),
          allowNull: false
      },
      model: {
          type: DataTypes.ENUM('MKR WAN 1310', 'Camera', 'Other'),
          allowNull: false
      },
      frequencyPlan: {
          type: DataTypes.ENUM('Europe 863-870 MHZ (SF12 for RX2)', 'Europe 863-870 MHZ (SF9 for RX2)-recommended'),
          allowNull: false
      },
      devEUI: {
          type: DataTypes.STRING(16),
          allowNull: false
      },
      appEUI: {
          type: DataTypes.STRING(16),
          allowNull: false
      },
      appKey: {
          type: DataTypes.STRING(34),
          allowNull: false
      },
      sensorname: {
          type: DataTypes.STRING(255),
          allowNull: false
      },
      location: DataTypes.STRING(255),

      localId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permitir que seja nulo, pois pode ser um novo local
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      description: DataTypes.TEXT
  }, {
      freezeTableName: true // Não pluralizar o nome da tabela
  });

  Sensor.associate = (models) => {
      Sensor.belongsTo(models.User, {
          foreignKey: 'userId',
          as: 'user'
      });

      Sensor.belongsTo(models.Locals, {
          foreignKey: 'localId',
          as: 'local'
      });
  };

  return Sensor;
};