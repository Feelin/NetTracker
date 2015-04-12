'use strict';

/**
 * Module dependencies.
 */
var api = require('../../app/controllers/api.server.controller'),
	preformance = require('../../app/controllers/api.server.controller');

module.exports = function(app) {
/*	app.route('/api/:appId').get(api.list);*/
	app.route('/api')
		.get(api.read)
		.post(api.create);

	app.route('/daily')
		.get(api.getDaily);
		
	/*app.param('appId', preformance.getPerformanceByID);*/
};