module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: true,
      },
    }, {
      freezeTableName: true
    });

  User.associate = (models) => {
      User.hasMany(models.Sensor, {
          foreignKey: 'userId',
          as: 'sensors'
      });
  };

  return User;
};