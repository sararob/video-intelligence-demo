import store from 'store';
import $ from 'jquery';
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

        // STORE VIDEO DATA
        if(store.enabled) {
          store.set('videos', videos);
          alert('videos retrieved');
        }
        else {
          this.videoStore = videos;
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