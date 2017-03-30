// Copyright 2017 Google Inc.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// DEPENDENCIES
import $ from 'jquery';
import _ from 'lodash';
import store from 'store'; //https://www.npmjs.com/package/store
import navigo from 'navigo';

// CONSTANTS
import {VIDEO_API} from './constants';

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
    this.$search = $('#search');
    this.currentPage = null;
    this.videoStore = [];

    // RENDER LOADING SPINNER
    this.renderLoadingIndicator();

    // IF DATA EXISTS RUN APP
    if(videoData) {
      this.initApp();
    }
    // OTHERWISE FETCH VIDEO DATA
    else {
      this.getVideoData();
    }
  }

  renderLoadingIndicator() {
    this.$stage.html('<h1 class="is-center text-title is-secondary l-pad-10">Loading One Moment...</h1>');
  }

  initApp() {
    this.initRouter();
    this.activateSearchBar();
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


  renderPage(page, data) {
    // CLEAR PREVIOUS PAGE
    if(this.currentPage && this.currentPage.destroy) {
      this.currentPage.destroy();
      this.currentPage = null;
    }

    // CLEAR STAGE
    this.clearStage();
    this.$search.val('');

    switch(page) {
      case 'home': this.currentPage = new HomePage(this.$stage, this.router); break;
      case 'search': this.currentPage = new SearchPage(this.$stage, this.router, data); break;
      case 'video': this.currentPage = new VideoPage(this.$stage, this.router, data); break;
      case 'profile': this.currentPage = new ProfilePage(this.$stage, this.router); break;
    }

    window.scrollTo(0,0);
  }

  activateSearchBar() {
    this.$search.keypress((e) => {
      if(e.which == 13){//Enter key pressed
        const query = this.$search.val();
        this.$search.blur();
        this.router.navigate(`/search/${query}`);
      }
    });
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
        const sortedVideos = _.sortBy(videos, ['name']);

        // STORE VIDEO DATA
        if(store.enabled) {
          store.set('videos', sortedVideos);
        }
        else {
          this.videoStore = sortedVideos;
        }

        that.initApp();
      }
    });
  }

  clearStage() {
    this.$stage.html('');
  }
}


export default App;

// START APPLICATION
$(document).ready(function() {
  new App();
});