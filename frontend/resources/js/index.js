import $ from 'jquery';
import * as d3 from 'd3';
import visavailChart from './timechart';


function renderVideo(id, link) {
  $('<a href="/video/' +  id + '"><video class="small-video" id="' + id + '" controls src="' + link + '"></video></a>').appendTo('#video');
}

String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = '0'+hours;}
  if (minutes < 10) {minutes = '0'+minutes;}
  if (seconds < 10) {seconds = '0'+seconds;}
  return hours+':'+minutes+':'+seconds;
};


$(document).ready(function() {

  // Get videos on page load
  // TODO - before send load videos
  $.ajax({
    url: window.location.protocol + '//' + window.location.host + '/getVideos',
    beforeSend: function() {
      $('#status').text('Loading video library...');
    },
    complete: function() {
      $('#status').text('');
    },
    success: function(msg, status, xhr) {
      var fileArray = xhr.responseJSON;

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


  $('#search').on('keypress', function(e) {
    if(e.which == 13) {
      var searchTerm = $('#search').val();
      window.location.replace(window.location.protocol + '//' + window.location.host + '/search?term=' + searchTerm);
    }
  });

  $('.second').on('click', function(e) {
    var vid = e.currentTarget.parentElement.childNodes[0].children[0];
    console.log(e);
    var sec = parseInt(e.target.textContent);
    vid.currentTime = sec | 0;
  });

});




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
      timeArr.push(['2017-01-02 ' + startTime.toString().toHHMMSS(), 1, '2017-01-02 ' + endTime.toString().toHHMMSS()]);
    }

    dataset.push({
      'measure': label['description'],
      data: timeArr
    });
  }
  var chart = visavailChart().width(800); // define width of chart in px
  d3.select('#' + div).datum(dataset).call(chart);
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