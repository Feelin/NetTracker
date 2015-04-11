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


app.directive('dayChart', function($window){
	return{
		restrict:'EA',
		template:"<svg></svg>",
		link: function(scope,elem){
			var d3 = $window.d3;
			var rawSvg=elem.find('svg');
			var svg = d3.select(rawSvg[0]);
			var padding = {left:50,bottom:50,top:20};
			var width =1200 - padding.left;
			var height = 500 - padding.bottom;
			

			svg.attr("width", width + padding.left)
    			.attr("height", height + padding.bottom + padding.top);

			scope.performances.$promise.then(function (dataset){
				var createdTime = [],
					alltime = [];
				angular.forEach(dataset,function (data){
					alltime.push(data.alltime);
					createdTime.push(new Date(data.created));
				});
				
				var x = d3.scale.ordinal()
						.domain(createdTime)
    					.rangeRoundBands([padding.left, width],0.1);
					   

				var yScale = d3.scale.linear()
								.domain([0,d3.max(alltime)])
								.range([height,padding.top]);
				

				var xScale = d3.scale.ordinal()
							.domain(d3.range(alltime.length))
							.rangeRoundBands([padding.left,width],0.1);

				var yAxis = d3.svg.axis()
							.scale(yScale)
							.tickSize(width)
    						.orient("right");
													

				svg.selectAll("rect")
				   .data(alltime)				   
				   .enter()
				   .append("rect")
				   .attr("x", function(d,i){
						return xScale(i);
				   } )
				   .attr("y",function(d,i){
						return yScale(d) ;
				   })
				   .attr("width", function(d,i){
						return xScale.rangeBand();
				   })
				   .attr("height", function(d,i){
				   		return height - yScale(d);
				   })
				   .attr("fill","#33b332");

				svg.selectAll("text")
		            .data(alltime)
		            .enter().append("text")
		            .attr("x", function(d,i){
						return xScale(i);
				   })
				   .attr("y",function(d,i){
						return yScale(d) ;
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
					.attr("class","y axis")
					.classed("minor", true)
					.call(yAxis)
				.selectAll("text")
				    .attr("x", 4)
				    .attr("dy", -4);

				svg.append("g")
					.attr("class", "x axis")
				    .attr("transform", "translate(0,"+ height+")")
				    .call(d3.svg.axis()
				        .scale(x)
				        .tickValues(createdTime)
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
				  if (!d3.event.sourceEvent) return; 
				  var extent = brush.extent();
					
				var x1 = Math.round(extent[0]/xScale.rangeBand())-2;
				var x2 = Math.round(extent[1]/xScale.rangeBand())-2;
		
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


app.directive('itemChart', function($window){
	return{
		restrict:'EA',
		template:"<svg></svg>",
		link: function(scope,elem){
			var d3 = $window.d3;
			var rawSvg=elem.find('svg');
			var svg = d3.select(rawSvg[0]);
			var padding = {left:50,bottom:40,top:20};
			var width =1200 - padding.left;
			var height = 500 - padding.bottom;					

			svg.attr("width", width + padding.left)
    			.attr("height", height + padding.bottom + padding.top)
    			.style("background","#f2f2f2");
    			
			scope.performances.$promise.then(function (dataset){
				var stack = d3.layout.stack(),
					n = Object.keys(dataset[0].timing).length,
					m = dataset.length,
					chartData = new Array(n),
					createdTime = [],
					daySplit = [],
					keys = ['perceived','redirect','cache','roundTrip','dnsLookup','tcpConnection','pageRender'];

				angular.forEach(dataset,function (data){
					createdTime.push(new Date(data.created));
				});			

				var dayRound = createdTime.map(d3.time.day.round);

				for(var t=0; t < dayRound.length - 1; t++){
					if(dayRound[t] < dayRound[t+1]) 
						daySplit.push({
							time: dayRound[t],
							index: t
						});
				}

				daySplit.push({index:dayRound.length - 1,time:dayRound[dayRound.length - 1]});

				for (var i=0; i < n; i++){
					chartData[i] = new Array();		
					var j = 0;			
					angular.forEach(dataset,function (data){
						chartData[i].push({
							x:j,
							y:data.timing[keys[i]],
							url:data.url,
							ip:data.ip
						});
						j++;						
					});
				}

				var layers = stack(chartData),
					yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
    				yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

    			var x = d3.scale.ordinal()
				    .domain(d3.range(m))
				    .rangeRoundBands([padding.left, width], .08);

				var xAxisScale = d3.scale.ordinal()
					.domain(createdTime)
					.rangeRoundBands([padding.left, width],0.08);	

    			var y = d3.scale.linear()
				    .domain([0, yStackMax])
				    .range([height, padding.top]);

				var yAxis = d3.svg.axis()
							.scale(y)
							.tickSize(width)
    						.orient("right");

				var color = d3.scale.linear()
				    .domain([0, n - 1])
				    .range(["#aad", "#556"]);

				var xAxis = d3.svg.axis()
				    .scale(xAxisScale)
				    .tickValues(createdTime)
			        .tickFormat(function (d) {
			        	return d3.time.format('%H:%M')(d);
			        })
			        .orient("bottom");	

				var layer = svg.selectAll(".layer")
				    .data(layers)
				  .enter().append("g")
				    .attr("class", "layer")
				    .attr("data-id",function (d, i) { return i;})
				    .style("fill", function (d, i) { return color(i); });

				var dayLine = svg.selectAll("rect")
				    .data(daySplit)
				  	.enter().append("rect")				  	
				    .attr("x", function (d) { return x(d.index) + x.rangeBand() -5;})
				    .attr("y", 0)
				    .attr("width", 12)
				    .attr("height",height)
				    .attr("fill","#33b332")
				    .style("opacity","0.3");

				svg.selectAll("text")
		            .data(daySplit)
		            .enter().append("text")	
		            .text(function (d) { return d3.time.format('%d')(d.time)+"日";})
		            .attr("x", function (d) { return x(d.index)-20;})
				    .attr("y", 20)
				    .style("fill","#33b332");
				    

				var rect = layer.selectAll("rect")
				    .data(function(d) { return d; })
				  	.enter().append("rect")				  	
				    .attr("x", function (d) { return x(d.x); })
				    .attr("y", height)
				    .attr("width", x.rangeBand())
				    .attr("height", 0)
				    .attr("data-url",function (d) { return d.url;})
				    .attr("data-ip",function (d) { return d.ip;});

				

				rect.on("mouseover",function (d){								
				    	var xPosition = parseFloat(Number(this.getAttribute("x"))+Number(x.rangeBand()/2)),
				    		yPosition = parseFloat(Number(this.getAttribute("y"))+Number( y(d.y0) - y(d.y0 + d.y))/2),
				    		tooltip = d3.select("#tooltip"),
				    		id = this.parentNode.getAttribute("data-id");

				    	tooltip.style("left",xPosition + "px")
				    		.style("top",yPosition + "px");
				    	tooltip.select("#item").text(keys[id]);
				    	tooltip.select("#value").text(d.y+"ms");
				    	tooltip.select("#url").text(this.getAttribute("data-url"));
				    	tooltip.select("#ip").text(this.getAttribute("data-ip"));
				    	tooltip.classed("hidden",false);
				    	d3.select(this).attr("fill","#33b332");
				    })
				    .on("mouseout",function (d){
				    	var id = this.parentNode.getAttribute("data-id");
				    	d3.select("#tooltip").classed("hidden",true);
				    	d3.select(this)				    		
				    		.transition()
				    		.delay(function (d,i){
				    			return i * 50;
				    		})
				    		.duration(250)
				    		.attr("fill", function (d) { return color(id); });
				    });

				rect.transition()
				    .delay(function(d, i) { return i * 10; })
				    .attr("y", function(d) { return y(d.y0 + d.y); })
				    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

				svg.append("g")
				    .attr("class", "x axis")
				    .attr("transform", "translate(0," + height + ")")
				    .call(xAxis)
				  .selectAll("text")
				  	.attr("transform", "rotate(45),translate(10,0)")
				  	.style("text-anchor","start");

				svg.append("g")
					.attr("class","y axis")
					.classed("minor", true)
					.call(yAxis)
				.selectAll("text")
				    .attr("x", 10)
				    .attr("dy", -4);				

				d3.selectAll("input").on("change", change);

				var timeout = setTimeout(function() {
				  d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
				}, 1000);

				function change() {
				  clearTimeout(timeout);
				  if (this.value === "grouped") transitionGrouped();
				  else transitionStacked();
				}

				function refreshYaxis(){
					d3.select(".y").transition()
				        .duration(500)
				        .delay(function(d, i) { return i * 10; })
				  	    .call(yAxis)
				  	.selectAll("text")
					    .attr("x", 10)
					    .attr("dy", -4);
				}

				function transitionGrouped() {
				    y.domain([0, yGroupMax]);				    
					rect.transition()
				        .duration(500)
				        .delay(function(d, i) { return i * 10; })
				        .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
				        .attr("width", x.rangeBand() / n)
				    	.transition()
				        .attr("y", function(d) { return y(d.y); })
				        .attr("height", function(d) { return height - y(d.y); });
				    refreshYaxis();
				}

				function transitionStacked() {
				  	y.domain([0, yStackMax]);				    
				  	rect.transition()
				        .duration(500)
				        .delay(function(d, i) { return i * 10; })
				        .attr("y", function(d) { return y(d.y0 + d.y); })
				        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
				    	.transition()
				        .attr("x", function(d) { return x(d.x); })
				        .attr("width", x.rangeBand());
				    refreshYaxis();
				}

				
			});
		}
	}
});