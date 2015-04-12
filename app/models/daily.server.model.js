'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var dailySchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	appId: {
		type: String,
		ref: 'Website'
	},
	pv: {
		type: Number,
		default: 0
	},
	day: {
		type: Date		
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
	},
	alltime: {
		type : Number,
		default: 0
	}	
});

mongoose.model('Daily', dailySchema);