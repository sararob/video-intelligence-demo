import _ from 'lodash';
import store from 'store';
import $ from 'jquery';

class VideoPage {
  constructor(stage, router, videoId) {
    this.$stage = stage;
    this.router = router;
    this.videoId = videoId;
    this.video = _.find(store.get('videos'), {url_safe_id: videoId});

    this.render();
    this.router.updatePageLinks();
    return this;
  }

  destroy() {
    console.log('destroy page');
  }

  template() {
    return `
      <header class="hero l-flex">
        <div class="hero-video col-1 no-margin">
          <video class="video-card-video" controls="true" id="${this.video.url_safe_id}" src="${this.video.link}"></video>
        </div>

        <div class="hero-sidebar col-fixed-4 no-margin">
          <h4 class="text-caption is-secondary is-uppercase">Top Labels</h4>
        </div>
      </header>

      <div class="announcement-bar sheet l-pad-2 clearfix">
        <div class="l-left">
          <h3 class="text-title">${this.video.name}</h3>
          <p class="text-body is-secondary" id="video-length"></p>
        </div>

        <button class="button l-right">
          <i class="material-icons">bookmark_border</i>
          Bookmark Video
        </button>
      </div>

      <article class="l-flex">
        <div class="col-1 l-pad-6 no-margin">
          Graphs
        </div>

        <asside class="col-fixed-4 no-margin l-pad-3">
          Some video cards
        </asside>
      </article>
    `;
  }

  getMetaData() {
    this.$video = $(`#${this.video.url_safe_id}`);
    const videoEl = this.$video[0];

    this.$video.on('loadedmetadata', () => {
      console.log(videoEl.duration);
    });
  }

  render() {
    this.$stage.html(this.template());
    this.getMetaData();
  }
}

export default VideoPage;