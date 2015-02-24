'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Website = mongoose.model('Website'),
	_ = require('lodash');


exports.create = function(req, res) {
	console.log(req.body);
};
