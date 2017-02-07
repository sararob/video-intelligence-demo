
function renderVideo(id, link) {
	$('<a href="/video/' +  id + '"><video class="small-video" id="' + id + '" controls src="' + link + '"></video></a>').appendTo('#video');
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
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
			// console.log(fileArray);
			videoData = fileArray;
			console.log(fileArray);
			for (var i in fileArray) {
				var video = fileArray[i];
				// console.log(video);
				maked3graph(video['annotations']['annotation_results'][0]['label_annotations'], video.url_safe_id);
				var faceAnnotations = video['annotations']['annotation_results'][0]['face_annotations'];
				renderFaces(faceAnnotations, video.url_safe_id);
				renderVideo(video.url_safe_id, video.link);
			}
		}
	});


	$('#search').on('click', function() {
		var searchTerm = $('#search-term').val();
		window.location.replace(window.location.protocol + '//' + window.location.host + '/search?term=' + searchTerm);
	});

	$('.second').on('click', function(e) {
		var vid = e.currentTarget.parentElement.childNodes[0].children[0];
		console.log(e);
		var sec = parseInt(e.target.textContent);
		vid.currentTime = sec | 0;
	});

});

function validateGCSUri(url) {
	if (url.substring(0,5) != "gs://") {
		// console.log('here');
		$('#status').text("Not a valid GCS URI. Please try again.").addClass('error');
		return;
	}
}

var d3CustomColors = ["#d27951", "#2dad06", "#8cb64a", "#c40db3", "#9a601e", "#fb731d", "#e2948b", "#479d53", "#a8ac7e", "#df773a", "#447b02", "#a2577e", "#4b83fd", "#f23dbe", "#f364b7", "#d88c4f", "#6c713d", "#6d8bb4", "#479b36", "#ad8132", "#5e97e7", "#c59ac9", "#b64a44", "#f88d2e", "#e04339", "#de4e6a", "#367680", "#f5603a", "#cb6ce7", "#ae9ded", "#d00a83", "#0f7f22", "#af5222", "#888f91", "#62b2d5", "#a4b105", "#fd76a5", "#79b870", "#09bda9"];

function maked3graph(data, div) {
	console.log(data);

	var dataset = [];

	for (var i in data) {
		var timeArr = [];
		var label = data[i];

		for (var j in label['locations']) {
			var segment = label['locations'][j];
			// console.log(segment);
			var startTime = segment['segment']['start_time_offset'] / 1000000 || 0;
			var endTime = segment['segment']['end_time_offset'] / 1000000;
			timeArr.push(["2017-01-02 " + startTime.toString().toHHMMSS(), 1, "2017-01-02 " + endTime.toString().toHHMMSS()]);
		}

		dataset.push({
			"measure": label['description'],
			data: timeArr
		})
	}
    var chart = visavailChart().width(800); // define width of chart in px
    d3.select("#" + div)
            .datum(dataset)
            .call(chart);
}

function renderFaces(faces, videoId) {
	for (var i in faces) {
		var face = faces[i];
		var b64thumbnail = face['thumbnail'];
		if (b64thumbnail) {
			// decode it
			$('<div class="face"><img src="data:image/jpeg;base64,' + b64thumbnail + '"/></div>').appendTo(('#' + videoId));
		}
	}
}
