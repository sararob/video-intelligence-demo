var d3CustomColors = ["#d27951", "#2dad06", "#8cb64a", "#c40db3", "#9a601e", "#fb731d", "#e2948b", "#479d53", "#a8ac7e", "#df773a", "#447b02", "#a2577e", "#4b83fd", "#f23dbe", "#f364b7", "#d88c4f", "#6c713d", "#6d8bb4", "#479b36", "#ad8132", "#5e97e7", "#c59ac9", "#b64a44", "#f88d2e", "#e04339", "#de4e6a", "#367680", "#f5603a", "#cb6ce7", "#ae9ded", "#d00a83", "#0f7f22", "#af5222", "#888f91", "#62b2d5", "#a4b105", "#fd76a5", "#79b870", "#09bda9"];


function renderVideo(id, link) {
	$('<a href="/video/' +  id + '"><video class="small-video" id="' + id + '" controls src="' + link + '"></video></a>').appendTo('#video');
}

$(document).ready(function() {

	var videoData;

	// Get videos on page load
	// TODO - before send load videos
	$.ajax({
		url: window.location.protocol + '//' + window.location.host + '/getVideos',
		beforeSend: function() {
			$('#status').text("Loading video library...");
		},
		complete: function() {
			$("#status").text("");
		},
		success: function(msg, status, xhr) {
			var fileArray = xhr.responseJSON;
			console.log(fileArray);
			videoData = fileArray;
			for (var i in fileArray) {
				var video = fileArray[i];
				renderVideo(video.url_safe_id, video.link);
			}
		}
	});


	$('#search').on('click', function() {
		var searchTerm = $('#search-term').val();
		window.location.replace(window.location.protocol + '//' + window.location.host + '/search?term=' + searchTerm);
	});


	$('#annotation-btn').on('click', function() {
		$("#graph").html("");
		$("#top-annotations").html("");
		$("#status").text("").removeClass("error");

		var url = $('#vid-url').val();
		validateGCSUri(url);

	    $.ajax({
	        type: 'POST',
	        url: window.location.protocol + '//' + window.location.host + '/video',
	    	headers: { 'Access-Control-Allow-Origin': '*'},
	        data: {url: url},
	        success: function(msg, status, jqXHR) {
	        	var data = jqXHR.responseJSON;
	        	// console.log(data);
	        	var timeObj = [];
	        	var videoAnnotations = {};
	        	var annotations = data['response']['results'][0]['annotations'];
	        	// console.log(data['response']);
	        	console.log(annotations);
	        	for (var i in annotations) {
	        		var annotation = annotations[i];
	        		// console.log(annotation);
	        		if ((annotation['timeOffset']) && (annotation['timeOffset'] != -1)) {
	        			timeObj.push({
	        				name: annotation['description'],
	        				confidence: annotation['confidence'],
	        				time: annotation['timeOffset'] / 1000
	        			});
	        		}
	        		if ((annotation['confidence'] > 0.8)) {
	        			videoAnnotations[annotation['description']] = annotation['confidence'];
	        		}
	        	}
	        	// console.log(videoAnnotations);

	        	var topAnnotations = [];
	        	for (var j in videoAnnotations) {
	        		var name = videoAnnotations[j];
	        		topAnnotations.push(j);
	        	}
	        	var str = "Top annotations: " + topAnnotations.join(", ");
	        	$('#top-annotations').text(str);
	        	maked3graph(timeObj);
	        	$('#annotation-btn').hide();
	        	$('#get-video').show();
	        	$('#vid-url').val("")
	        	$('#vid-url').removeAttr('disabled');
	        	// console.log(timeObj);
	        },
	        beforeSend: function() {
	        	$(".mdl-spinner").addClass("is-active");
	        },
	        complete: function() {
	        	$(".mdl-spinner").removeClass("is-active")
	        },
	        error: function(xhr, status, error) {
	        	$('#status').text(xhr['responseText']).addClass('error');
	        }
	    });
	});

	$('#vision').on('click', function() {
		var imgurl = $('#img-url').val();
		$.ajax({
			type: 'POST',
			url: window.location.protocol + '//' + window.location.host + '/vision',
			data: {url: imgurl},
			success: function(message, stat, imgdata) {
				console.log(imgdata);
			}
		});
	});

});

function validateGCSUri(url) {
	if (url.substring(0,5) != "gs://") {
		// console.log('here');
		$('#status').text("Not a valid GCS URI. Please try again.").addClass('error');
		return;
	}
}

function maked3graph(data) {
	console.log(data);
	$("#status").text("");

	// console.log(data);
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 800 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	// setup x 
	var xValue = function(d) { return d.time;}, // data -> value
	    xScale = d3.scale.linear().range([0, width]), // value -> display
	    xMap = function(d) { return xScale(xValue(d));}, // data -> display
	    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	// setup y
	var yValue = function(d) { return d.confidence;}, // data -> value
	    yScale = d3.scale.linear().range([height, 0]), // value -> display
	    yMap = function(d) { return yScale(yValue(d));}, // data -> display
	    yAxis = d3.svg.axis().scale(yScale).orient("left");

	// // setup fill color
	var cValue = function(d) { return d.name;},
	    color = d3.scale.ordinal().domain([1,data.length]).range(d3CustomColors);

	// add the graph canvas to the body of the webpage
	var svg = d3.select("#graph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add the tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
	    .attr("class", "tooltip")
	    .style("opacity", 0);

	  // don't want dots overlapping axis, so add in buffer to data domain
	  xScale.domain([d3.min(data, xValue)-0.1, d3.max(data, xValue)+0.1]);
	  yScale.domain([0, 1.0]); // Confidence score

	  // x-axis
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("Seconds");

	  // y-axis
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Confidence Score");

	  // draw dots
	  svg.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", 5)
	      .attr("cx", xMap)
	      .attr("cy", yMap)
	      .style("fill", function(d) { return color(cValue(d));})
	      .on("mouseover", function(d) {
	          tooltip.transition()
	               .duration(200)
	               .style("opacity", 1);
	          tooltip.html(d["name"])
	          .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
	      })
	      .on("mouseout", function(d) {
	          tooltip.transition()
	               .duration(500)
	               .style("opacity", 0);
	      })
	      .on("mousemove", function() {return tooltip.style("top",
    (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
	      .on("click", function(d) {
	      	var second = (d['time']);
	      	// console.log(second);
	      	var vid = $('#video').children('video')[0];
	      	vid.currentTime = second | 0;
	      });

	  // draw legend
	  var legend = svg.selectAll(".legend")
	      .data(findTopLabels(data))
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) {
	      	// console.log(color.domain());
	      	return "translate(200," + (i * 20) + ")"; });

	  // draw legend colored rectangles
	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color);

	  // draw legend text
	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d;})

}

// Display top 20 labels in legend
function findTopLabels(data) {
	var legendData = {};
	var legendArr = [];
	for (var i in data) {
		var annotation = data[i];
		// Count occurrences of all labels with a confidence higher than 0.5
		if (annotation['confidence'] > 0.5) {
			if (legendData[annotation['name']]) {
				legendData[annotation['name']] = legendData[annotation['name']] + 1
			} else {
				legendData[annotation['name']] = 1
			}
		}
	}

	// Sort data by most occurrences
	var sortable = [];
	for (var label in legendData) {
		sortable.push([label, legendData[label]]);
	}

	sortable.sort(function(a,b) {
		return a[1] - b[1];
	});

	// Get array of top 10 labels for legend
	for (var i = 0; i < 20; i++) {
		if ((i + 1) <= sortable.length) {
			legendArr.push(sortable[i][0]);
		}
	}
	return legendArr.reverse();
}