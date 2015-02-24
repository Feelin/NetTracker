'use strict';

// Setting up route
angular.module('websites').config(['$stateProvider',
	function($stateProvider) {
		// websites state routing
		$stateProvider.
		state('listwebsites', {
			url: '/websites',
			templateUrl: 'modules/websites/views/list-websites.client.view.html'
		}).
		state('createwebsite', {
			url: '/websites/create',
			templateUrl: 'modules/websites/views/create-website.client.view.html'
		}).
		state('viewwebsite', {
			url: '/websites/:websiteId',
			templateUrl: 'modules/websites/views/view-website.client.view.html'
		}).
		state('editwebsite', {
			url: '/websites/:websiteId/edit',
			templateUrl: 'modules/websites/views/edit-website.client.view.html'
		});
	}
]);