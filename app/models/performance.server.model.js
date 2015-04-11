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
	ip:{
		type: String
	},
	timing: {
		type: Object
	},
	alltime: {
		type : Number
	}	
});

mongoose.model('Performance', performanceSchema);