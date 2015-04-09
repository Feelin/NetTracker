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
		template:"<svg></svg>",
		link: function(scope,elem){
			var d3 = $window.d3;
			var rawSvg=elem.find('svg');
			var svg = d3.select(rawSvg[0]);
			var padding = {left:50,bottom:150,top:20};
			var width =1200 - padding.left;
			var height = 500 - padding.bottom;
			

			svg.attr("width", width + padding.left)
    			.attr("height", height + padding.bottom + padding.top);

			scope.performances.$promise.then(function (dataset){
				var xtime = [],
					alltime = [];
				angular.forEach(dataset,function (data){
					alltime.push(data.alltime);
					xtime.push(new Date(data.created));
				});
				
				var x = d3.scale.ordinal()
						.domain(xtime)
    					.rangeRoundBands([padding.left, width],0.1);
					   

				var yAxisScale = d3.scale.linear()
								.domain([0,d3.max(alltime)])
								.range([height - padding.top,0]);


				var yAxis = d3.svg.axis()
							.scale(yAxisScale)
							.orient("left");

				var xScale = d3.scale.ordinal()
							.domain(d3.range(alltime.length))
							.rangeRoundBands([padding.left,width],0.1);
									
				var yScale = d3.scale.linear()
							.domain([0,d3.max(alltime)])
							.range([0,height - padding.top]);


				svg.selectAll("rect")
				   .data(alltime)
				   .enter()
				   .append("rect")
				   .attr("x", function(d,i){
						return xScale(i);
				   } )
				   .attr("y",function(d,i){
						return height - yScale(d) ;
				   })
				   .attr("width", function(d,i){
						return xScale.rangeBand();
				   })
				   .attr("height",yScale)
				   .attr("fill","#33b332");

				svg.selectAll("text")
		            .data(alltime)
		            .enter().append("text")
		            .attr("x", function(d,i){
						return xScale(i);
				   })
				   .attr("y",function(d,i){
						return height - yScale(d) ;
				   })
		            .attr("dx", function(d,i){
						return xScale.rangeBand()/2;
				   })
		            .attr("dy", 15)
					.attr("text-anchor", "middle")
					.attr("font-size", 11)
					.attr("text-alient", 11)
					.attr("fill","white")
		            .text(function(d,i){
						return d;
					});
				 
					
				svg.append("g")
					.attr("class","axis")
					.attr("transform","translate("+padding.left+","+padding.top+")")
					.call(yAxis); 

				svg.append("g")
					.attr("class", "x axis")
				    .attr("transform", "translate(0,"+ height+")")
				    .call(d3.svg.axis()
				        .scale(x)
				        .tickValues(xtime)
				        .tickFormat(function (d) {
				        	return d3.time.format('%H:%M')(d);
				        })
				        .orient("bottom")				       		        
				  	)
				  	.selectAll("text")
				  	.attr("transform", "rotate(90),translate(10,-"+ xScale.rangeBand()/2 +")")
				  	.style("text-anchor","start");


				var brush = d3.svg.brush()
						    .x(x)
						    .on("brushend", brushended)
						    .on("brushstart", brushstart);

				var gBrush = svg.append("g")
				    .attr("class", "brush")				   
				    .call(brush)
				    .call(brush.event);

				gBrush.selectAll("rect")
				    .attr("height", height);

				function brushended() {
				  if (!d3.event.sourceEvent) return; // only transition after input

				  var extent = brush.extent();
					
				console.log(extent)
				//  var extent1 = extent0.map(d3.time.minute.round);
				
				  // if empty when rounded, use floor & ceil instead
				/*  if (extent1[0] >= extent1[1]) {
				    extent1[0] = d3.time.minute.floor(extent0[0]);
				    extent1[1] = d3.time.minute.ceil(extent0[1]);
				  }
*/
				  d3.select(this).transition()
				      .call(brush.extent(extent))
				      .call(brush.event);
				}

				function brushstart() {
					brush.clear();
				}



			});

		}
	}
});

