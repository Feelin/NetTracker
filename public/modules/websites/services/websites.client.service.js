'use strict';

//Websites service used for communicating with the Websites REST endpoints
angular.module('websites').factory('Websites', ['$resource',
	function($resource) {
		return $resource('websites/:websiteId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);