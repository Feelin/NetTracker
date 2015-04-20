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
		perceived: {
			type: Object,
			default: 0
		},
		redirect: {
			type: Object,
			default: 0
		},
		cache: {
			type: Object,
			default: 0
		},
		dnsLookup:  {
			type: Object,
			default: 0
		},
		tcpConnection:  {
			type: Object,
			default: 0
		},
		roundTrip: {
			type: Object,
			default: 0
		},
		pageRender: {
			type: Object,
			default: 0
		}
	}
});

mongoose.model('Performance', performanceSchema);