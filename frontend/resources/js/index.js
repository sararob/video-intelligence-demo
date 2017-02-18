import $ from 'jquery';
import * as d3 from 'd3';
import visavailChart from './timechart';
import store from 'store'; //https://www.npmjs.com/package/store

const VIDEO_URL = window.location.protocol + '//' + window.location.host + '/getVideos';
let videoStore;

class App {
  constructor() {
    const hasLocalStorage = store.enabled;
    console.log(VIDEO_URL);

    if(hasLocalStorage) {
      const videos = store.get('videos');

      if(videos) {
        console.log(videos);
      }
      else {
        this.getVideoData();
      }
    }
    else {
      console.log('no local storage avaialble');
    }
  }

  getVideoData() {
    $.ajax({
      url: VIDEO_URL,

      beforeSend() {
        $('#status').text('Loading video library...');
      },

      complete() {
        $('#status').text('');
      },

      success(msg, status, xhr) {
        var fileArray = xhr.responseJSON;
        store.set('videos', fileArray);

        for (var i in fileArray) {
          var video = fileArray[i];
          // console.log(video);
          // maked3graph(video['annotations']['annotation_results'][0]['label_annotations'], video.url_safe_id);
          // var faceAnnotations = video['annotations']['annotation_results'][0]['face_annotations'];
          // renderFaces(faceAnnotations, video.url_safe_id);
          // renderVideo(video.url_safe_id, video.link);
        }
      }
    });
  }
}

export default App;

$(document).ready(function() {
  new App();
});