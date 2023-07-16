module.exports = (sequelize, DataTypes) => {
    const Sensor = sequelize.define('Sensor', {
       model: {
         type: DataTypes.STRING(255),
         allowNull: false,
         defaultValue: 'Arduino MKR WAN 1310',
          },
      devEUI: {
        type: DataTypes.STRING(16),
        allowNull: false,
      },
      appKey: {
        type: DataTypes.STRING(34),
        allowNull: false,
      },
      sensorname: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true // torna o campo sensorname único
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      localId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: DataTypes.TEXT,
    }, {
      freezeTableName: true,
    });
  
    Sensor.associate = (models) => {
      Sensor.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
  
      Sensor.belongsTo(models.Locals, {
        foreignKey: 'localId',
        as: 'local',
      });

      

      Sensor.hasMany(models.SensorData, {
        foreignKey: 'sensorId',
        as: 'sensorData',
      });
    };
  
    return Sensor;
  };