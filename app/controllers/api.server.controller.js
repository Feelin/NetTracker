'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Performance = mongoose.model('Performance'),
	_ = require('lodash');


exports.create = function(req, res) {
	var data = req.body;
	var performance = new Performance();
	performance.appId = data.appId;
	performance.timing = JSON.parse(data.timing);
	performance.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log("performance save success!");
		}
	});
};

exports.list = function(req, res) {
	res.json(req.performance);
};

exports.read = function(req, res) {
	var appId = req.query.appId;
	Performance.find({appId:appId}).sort('-created').exec(function(err, performance) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(performance);
		}
	});
};

exports.getPerformanceByID = function(req, res, next, id) {

	Performance.find({appId:id}).exec(function(err, performance) {
		if (err) return next(err);
		if (!performance) {
			return res.status(404).send({
  				message: 'Website not found'
  			});
		}
		req.performance = performance;
		next();
	});
};

