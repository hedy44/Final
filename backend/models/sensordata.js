module.exports = (sequelize, DataTypes) => {
    const SensorData = sequelize.define('sensorData', {
      temperature: {
        type: DataTypes.FLOAT,
      },
      humidity: {
        type: DataTypes.FLOAT,
      },
      sensorname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    SensorData.associate = (models) => {
      SensorData.belongsTo(models.Sensor, {
        foreignKey: 'sensorname',
        as: 'sensor',
      });
  
      SensorData.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    };
  
    return SensorData;
  };
  