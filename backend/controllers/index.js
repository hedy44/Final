const controllers = {};

controllers.user = require('./user');
controllers.sensor = require('./sensor');
controllers.locals = require('./locals');

module.exports = controllers;