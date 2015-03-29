'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var performanceSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	appId: {
		type: String,
		ref: 'Website'
	},
	url:{
		type: String
	},
	useragent:{
		type: String
	},
	timing: {
		type: Object
	}
});

mongoose.model('Performance', performanceSchema);