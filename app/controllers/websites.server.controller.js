'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Website = mongoose.model('Website'),
	_ = require('lodash');

/**
 * Create a website
 */
exports.create = function(req, res) {
	var website = new Website(req.body);
	website.user = req.user;
	console.log(website);
	website.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(website);
		}
	});
};

/**
 * Show the current website
 */
exports.read = function(req, res) {
	res.json(req.website);
};

/**
 * Update a website
 */
exports.update = function(req, res) {
	var website = req.website;

	website = _.extend(website, req.body);

	website.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(website);
		}
	});
};

/**
 * Delete an website
 */
exports.delete = function(req, res) {
	var website = req.website;

	website.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(website);
		}
	});
};

/**
 * List of website
 */
exports.list = function(req, res) {
	Website.find().sort('-created').populate('user', 'displayName').exec(function(err, website) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(website);
		}
	});
};

/**
 * website middleware
 */
exports.getWebsiteByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'website is invalid'
		});
	}

	Website.findById(id).populate('user', 'displayName').exec(function(err, website) {
		if (err) return next(err);
		if (!website) {
			return res.status(404).send({
  				message: 'Website not found'
  			});
		}
		req.website = website;
		next();
	});
};

/**
 * website authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.website.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};