import $ from 'jquery';
import * as d3 from 'd3';
import visavailChart from './timechart';
import store from 'store'; //https://www.npmjs.com/package/store
import navigo from 'navigo';

const VIDEO_URL = window.location.protocol + '//' + window.location.host + '/getVideos';
let videoStore;

class App {
  constructor() {
    const videoData = store.enabled ? store.get('videos') : false;

    // REGISTER ELEMENTS
    this.$stage = $('#stage');
    this.$topnav = $('#top-nav');

    // RENDER LOADING SPINNER
    //this.renderLoadingIndicator();

    // IF DATA EXISTS RUN APP
    if(videoData) {
      console.log(videoData);
      this.initRouter();
    }
    // OTHERWISE FETCH VIDEO DATA
    else {
      this.getVideoData();
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
        const videos = xhr.responseJSON;

        // STORE VIDEO DATA
        if(store.enabled) {
          store.set('videos', videos);
        }
        else {
          videoStore = videos;
        }


        for (var i in videos) {
          var video = videos[i];
          // console.log(video);
          // maked3graph(video['annotations']['annotation_results'][0]['label_annotations'], video.url_safe_id);
          // var faceAnnotations = video['annotations']['annotation_results'][0]['face_annotations'];
          // renderFaces(faceAnnotations, video.url_safe_id);
          // renderVideo(video.url_safe_id, video.link);
        }
      }
    });


  }

  initRouter() {
    this.router = new navigo(null, false);
    this.router.updatePageLinks();

    this.router.on({
      'products/:id': function () {
        console.log('Products');
      },
      '/about': function () {
        console.log('About');
      },
      '*': function () {
        console.log('Home');
      }
    })
    .resolve();

  }

  clearStage() {

  }

  renderLoadingIndicator() {
    this.$stage.html('<h1>Loading One Moment...</h1>');
  }

  renderHomepage() {

  }

  renderSearchResults() {

  }

  renderDetailPage() {

  }
}

export default App;

$(document).ready(function() {
  new App();
});