'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	api = require('../../app/controllers/api.server.controller');

module.exports = function(app) {
	app.route('/api')
		.post(api.create);
};