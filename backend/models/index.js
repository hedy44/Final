const dbConfig = require('../config/db_config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DATABASE,dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT
});

const db = {};

db.sequelize = sequelize;
db.models = {};
db.models.User = require('./user')(sequelize, Sequelize.DataTypes);
db.models.Sensor = require('./sensor')(sequelize, Sequelize.DataTypes);
db.models.Locals = require('./locals')(sequelize, Sequelize.DataTypes);
db.models.SensorData = require('./sensordata')(sequelize, Sequelize.DataTypes);

module.exports = db;