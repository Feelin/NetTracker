'use strict';

//Websites service used for communicating with the Websites REST endpoints
angular.module('websites').factory('Websites', ['$resource',
	function($resource) {
		return $resource('websites/:websiteId', {
			websiteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


angular.module('websites').factory('Performance', ['$resource',
	function($resource) {
		return $resource('api/:websiteId', {
			appId: '@_id'
		},{
			getArray: {
				method:"GET", isArray: true
			}
		});
	}
]);

angular.module('websites').factory('Daily', ['$resource',
	function($resource) {
		return $resource('daily/:websiteId', {
			appId: '@_id'
		});
	}
]);


