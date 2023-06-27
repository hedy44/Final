const controllers = {};

controllers.user = require('./user');
controllers.sensor = require('./sensor');
controllers.locals = require('./locals');
controllers.readings = require('./readingsController');


module.exports = controllers;