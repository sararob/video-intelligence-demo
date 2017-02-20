import $ from 'jquery';
import store from 'store'; //https://www.npmjs.com/package/store
import navigo from 'navigo';
import VideoCard from './video-card';

const VIDEO_URL = window.location.protocol + '//' + window.location.host + '/getVideos';
var VIDEO_STORE;


class App {
  constructor() {
    const videoData = store.enabled ? store.get('videos') : false;

    // REGISTER ELEMENTS
    this.$stage = $('#stage');
    this.$topnav = $('#top-nav');

    // RENDER LOADING SPINNER
    this.renderLoadingIndicator();

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
          VIDEO_STORE = videos;
        }

        this.initRouter();
      }
    });
  }

  initRouter() {
    this.router = new navigo(null, false);
    this.router.updatePageLinks();

    this.router.on({
      '/': () => {
        this.renderHomepage();
      },
      '/profile': () => {
        this.renderProfile();
      },
      '/video/:id': (params) => {
        this.renderVideoPage(params.id);
      },
      '/search/:query': () => {
        this.renderSearchResults();
      }
    })
    .resolve();
  }

  clearStage() {
    this.$stage.html('');
  }

  renderLoadingIndicator() {
    this.$stage.html('<h1>Loading One Moment...</h1>');
  }

  renderHomepage() {
    const videos = store.get('videos');
    this.clearStage();

    for(var i = 0, l = videos.length; i < l; i++) {
      this.$stage.append(VideoCard(videos[i]));
    }
  }

  renderProfile() {
    this.$stage.html('<h1>Profile</h1>');
  }

  renderSearchResults() {
    this.$stage.html('<h1>Results</h1>');
  }

  renderVideoPage(id) {
    this.$stage.html(`<h1>Video Id: ${id}</h1>`);
  }
}


export default App;

// START APPLICATION
$(document).ready(function() {
  new App();
});