'use strict';

angular.module('websites').controller('WebsitesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Websites','Performance',
	function($scope, $stateParams, $location, Authentication, Websites,Performance) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var website = new Websites({
				title: this.title,
				URL: this.URL
			});
			website.$save(function(response) {
				$location.path('websites/' + response._id);

				$scope.title = '';
				$scope.URL = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(website) {
			if (website) {
				website.$remove();

				for (var i in $scope.websites) {
					if ($scope.websites[i] === website) {
						$scope.websites.splice(i, 1);
					}
				}
			} else {
				$scope.website.$remove(function() {
					$location.path('websites');
				});
			}
		};

		$scope.update = function() {
			var website = $scope.website;

			website.$update(function() {
				$location.path('websites/' + website._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.websites = Websites.query();
		};

		$scope.findOne = function() {
			$scope.website = Websites.get({
				websiteId: $stateParams.websiteId
			});
			$scope.performances = Performance.query({
				appId:$stateParams.websiteId
			});
			console.log($scope.performances);
		};
	}
]);

