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

import store from 'store';
import $ from 'jquery';
import _ from 'lodash';
import {VIDEO_API} from '../constants';

class ProfilePage {
  constructor(stage, router) {
    this.$stage = stage;
    this.router = router;


    this.render();
    this.activateLinks();
    return this;
  }

  activateLinks() {
    this.clearButton = $('#clearstore');
    this.getVideosButton = $('#getvideos');

    this.clearButton.on('click', () => {
      store.remove('videos');
    });

    this.getVideosButton.on('click', () => {
      this.getVideoData();
    });
  }

  render() {
    this.$stage.html(this.template());
  }

  destroy() {
    this.clearButton.off();
    this.getVideosButton.off();
  }

  getVideoData() {
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
          alert('videos retrieved');
        }
        else {
          this.videoStore = sortedVideos;
        }
      }
    });
  }

  template() {
    return `
      <div class=" l-pad-6">
        <button id="clearstore" class="button button-large l-space-right-2">Clear Local Storage</button>
        <button id="getvideos" class="button button-large">Get Videos</button>
      </div>
    `;
  }


}

export default ProfilePage;