'use strict';

var app = angular.module('websites');
app.controller('WebsitesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Websites','Performance',
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
			$scope.performances = Performance.getArray({
				appId:$stateParams.websiteId
			});					
		};

	}
]);


 app.directive('linearChart', function($window){
	return{
		restrict:'EA',
		template:"<svg width='1200' height='600'></svg>",
		link: function(scope,elem){
			var d3 = $window.d3;
			var rawSvg=elem.find('svg');
			var svg = d3.select(rawSvg[0]);
			scope.performances.$promise.then(function (dataset){
				var alltime = [];
				angular.forEach(dataset,function (data){
					alltime.push(data.alltime);
				});
				console.log(alltime.length);
				var xAxisScale = d3.scale.ordinal()
								.domain(d3.range(alltime.length))
								.rangeRoundBands([0,1000]);
				var yAxisScale = d3.scale.linear()
								.domain([0,d3.max(alltime)])
								.range([500,0]);

				var xAxis = d3.svg.axis()
							.scale(xAxisScale)
							.orient("bottom");		
				var yAxis = d3.svg.axis()
							.scale(yAxisScale)
							.orient("left");

				var xScale = d3.scale.ordinal()
							.domain(d3.range(alltime.length))
							.rangeRoundBands([0,1000],0.1);
									
				var yScale = d3.scale.linear()
							.domain([0,d3.max(alltime)])
							.range([0,500]);

				svg.selectAll("rect")
				   .data(alltime)
				   .enter()
				   .append("rect")
				   .attr("x", function(d,i){
						return 50 + xScale(i);
				   } )
				   .attr("y",function(d,i){
						return 50 + 500 - yScale(d) ;
				   })
				   .attr("width", function(d,i){
						return xScale.rangeBand();
				   })
				   .attr("height",yScale)
				   .attr("fill","#959595");

				svg.selectAll("text")
		            .data(alltime)
		            .enter().append("text")
		            .attr("x", function(d,i){
						return 40 + xScale(i);
				   })
				   .attr("y",function(d,i){
						return 30 + 500 - yScale(d) ;
				   })
		            .attr("dx", function(d,i){
						return xScale.rangeBand()/3;
				   })
		            .attr("dy", 15)
					.attr("text-anchor", "begin")
					.attr("font-size", 11)
					.attr("fill","black")
		            .text(function(d,i){
						return d;
					});
				   
				svg.append("g")
					.attr("class","axis")
					.attr("transform","translate(50,550)")
					.call(xAxis);
					
				svg.append("g")
					.attr("class","axis")
					.attr("transform","translate(50,50)")
					.call(yAxis); 


			});

		}
	}
});

