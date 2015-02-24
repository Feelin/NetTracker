'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	websites = require('../../app/controllers/websites.server.controller');

module.exports = function(app) {
	// website Routes
	app.route('/websites')
		.get(websites.list)
		.post(users.requiresLogin, websites.create);

	app.route('/websites/:websiteId')
		.get(websites.read)
		.put(users.requiresLogin, websites.hasAuthorization, websites.update)
		.delete(users.requiresLogin, websites.hasAuthorization, websites.delete);

	// Finish by binding the website middleware
	app.param('websiteId', websites.getWebsiteByID);
};