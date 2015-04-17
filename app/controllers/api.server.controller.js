'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Performance = mongoose.model('Performance'),
	Daily = mongoose.model('Daily'),
	_ = require('lodash'),
	async = require('async');

exports.create = function(req, res) {
	var data = JSON.parse(req.body.data);
	var performance = new Performance();
	performance.appId = data.id;
	performance.url = data.url;
	performance.ip = req.headers['x-forwarded-for'] ||
				    req.connection.remoteAddress ||
				    req.socket.remoteAddress ||
				    req.connection.socket.remoteAddress;

	performance.timing = {
		perceived: data.perceivedTime,
		redirect: data.redirectTime,
		cache: data.cacheTime,
		dnsLookup: data.dnsLookupTime,
		tcpConnection: data.tcpConnectionTime,
		roundTrip: data.roundTripTime,
		pageRender: data.pageRenderTime
	}	
	performance.alltime = 0;
	for(var item in performance.timing){
		performance.alltime += performance.timing[item];
	}
	var query = { 
			appId: performance.appId,
			day: new Date(new Date().toDateString())
		},
		update = {},
		dailyAllTime = 0;
	async.parallel([
	    function (callback){
	    	performance.save();
	    	callback(null,null);
	    },
	    function (callback){
	    	async.series([function (callback){
	    		Daily.find(query).exec(function(err, daily) {		
		    		if(daily.length == 0){
		    			daily = [{timing:{
		    				perceived: 0,
							redirect: 0,
							cache: 0,
							dnsLookup: 0,
							tcpConnection: 0,
							roundTrip: 0,
							pageRender: 0
		    				},
		    				pv: 0
		    			}];
		    		}
					for(var key in performance.timing){
						update[key] = dailyPush(daily[0].timing[key],performance.timing[key],daily[0].pv);
					}
					for(var key in update){
						dailyAllTime += update[key];
					}
					callback(null,null);
				});
	    	},function (callback){
	    		Daily.update(query, {
							$set: {
								alltime: dailyAllTime,
								timing: update
							}, 
							$inc:{ pv: 1} 
						},  {upsert: true }, function (err){
						
					});
	    		callback(null,null);
	    	}],function (err,results){
	    		if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					console.log("daily save success!");
				}
	    	});//series
	    	callback(null,null);
	    }], function (err, results){
	 	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log("performance save success!");
		}
	});


};

/*exports.list = function(req, res) {
	res.json(req.performance);
};*/

exports.read = function(req, res) {
	var appId = req.query.appId;
	Performance.find({appId:appId}).sort('-created').limit(50).exec(function(err, performance) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(performance);
		}
	});
};

/*exports.getPerformanceByID = function(req, res, next, id) {

	Performance.find({appId:id}).sort('created').exec(function(err, performance) {
		if (err) return next(err);
		if (!performance) {
			return res.status(404).send({
  				message: 'Website not found'
  			});
		}
		req.performance = performance;
		next();
	});
};*/

exports.getDaily = function(req, res) {
	var appId = req.query.appId;
	Daily.find({appId:appId}).sort('-created').exec(function(err, daily) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json({data:daily});
		}
	});
};

function dailyPush (oldData,newData,num){
	return Math.round( (oldData * num + newData)/(num + 1) );
}

