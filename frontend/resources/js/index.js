// DEPENDANCIES
import $ from 'jquery';
import store from 'store'; //https://www.npmjs.com/package/store
import navigo from 'navigo';

// CONSTANTS
import {VIDEO_API, AUTH_API} from './constants';

// PAGES
import HomePage from './pages/homepage';
import VideoPage from './pages/videopage';
import SearchPage from './pages/searchpage';
import ProfilePage from './pages/profilepage';


class App {
  constructor() {
    const videoData = store.enabled ? store.get('videos') : false;

    // REGISTER ELEMENTS
    this.$stage = $('#stage');
    this.$topnav = $('#top-nav');
    this.currentPage = null;
    this.videoStore = [];

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
    const that = this;

    $.ajax({
      url: VIDEO_API,

      beforeSend() {
        $('#status').text('Loading video library...');
      },

      complete() {
        $('#status').text('');
      },

      success(msg, status, xhr) {
        const videos = xhr.responseJSON;
        console.log(xhr.responseJSON);

        // STORE VIDEO DATA
        if(store.enabled) {
          store.set('videos', videos);
        }
        else {
          this.videoStore = videos;
        }

        that.initRouter();
      }
    });
  }

  initRouter() {
    this.router = new navigo(null, false);
    this.router.updatePageLinks();


    this.router.on({
      '/': () => {
        this.renderPage('home');
      },
      '/profile': () => {
        this.renderPage('profile');
      },
      '/video/:id': (params) => {
        this.renderPage('video', params.id);
      },
      '/search/:query': (params) => {
        this.renderPage('search', params.query);
      }
    })
    .resolve();
  }

  clearStage() {
    this.$stage.html('');
  }

  renderPage(page, id) {
    // CLEAR PREVIOUS PAGE
    if(this.currentPage && this.currentPage.destroy) {
      this.currentPage.destroy();
      this.currentPage = null;
    }

    // CLEAR STAGE
    this.clearStage();

    switch(page) {
      case 'home': this.currentPage = new HomePage(this.$stage, this.router); break;
      case 'search': this.currentPage = new SearchPage(this.$stage, this.router); break;
      case 'video': this.currentPage = new VideoPage(this.$stage, this.router, id); break;
      case 'profile': this.currentPage = new ProfilePage(this.$stage, this.router); break;
    }
  }

  renderLoadingIndicator() {
    this.$stage.html('<h1>Loading One Moment...</h1>');
  }
}


export default App;

// START APPLICATION
$(document).ready(function() {
  new App();
});