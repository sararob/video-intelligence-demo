import _ from 'lodash';
import store from 'store';
import $ from 'jquery';

import VideoCard from '../components/video-card';

class VideoPage {
  constructor(stage, router, videoId) {
    // REGISTER VARIABLES
    this.$stage = stage;
    this.router = router;
    this.videoId = videoId;
    this.videoLength = '';
    this.videos = store.get('videos');
    this.video = _.find(this.videos, {url_safe_id: videoId});
    this.title = _.capitalize(this.video.name.replace(/(\-)|(\_)|(\.mov|.mp4|.webm)/gi, ' ').trim());

    console.log(this.video);

    // RENDER PAGE
    this.render();
    return this;
  }

  render() {
    // INJECT TEMPLATE INTO STAGE
    this.$stage.html(this.template());

    // REGISTER TEMPLATE ELEMENTS
    this.$video = $(`#${this.video.url_safe_id}`);
    this.$videoLength =  $('#video-length');
    this.$topLabels = $('#top-labels');
    this.$graphs = $('#graphs');
    this.$relatedVideos = $('#related-videos');

    // RENDER DATA ON PAGE
    this.renderVideoLength();
    this.renderTopLabels();
    this.renderGraph();
    this.renderVideoCards();

    // UPDATE PAGE LINKS
    this.router.updatePageLinks();
  }


  renderVideoLength() {
    // WAIT FOR META DATA TO LOAD
    this.$video.on('loadedmetadata', () => {
      const mins = parseInt(this.$video[0].duration / 60, 10);
      const seconds = parseInt(this.$video[0].duration % 60, 10);

      // FORMAT DATA AND RENDER
      this.videoLength = `${mins}:${seconds}`;
      this.$videoLength.append(this.videoLength);

      // REMOVE EVENT LISTENERS (CLEANUP)
      this.$video.off();
    });
  }

  renderTopLabels() {
    const labels = this.video.annotations.label_annotations;

    for (var i = 0; i < labels.length; i++) {
      let label = labels[i];

      if(i < 10) {
        this.$topLabels.append(`<li>${label.description}</li>`);
      }
    }
  }

  renderGraph() {
    const labels = this.video.annotations.label_annotations;

    for (var i = 0; i < labels.length; i++) {
      let label = labels[i];

      this.$graphs.append(`<li>${label.description}</li>`);
    }
  }

  renderVideoCards() {
    for (var i = 0; i < 3; i++) {
      this.$relatedVideos.append(`
        <div class="l-space-bottom-3">${VideoCard(this.videos[i])}</div>
      `);
    }
  }

  template() {
    return `
      <header class="hero l-flex">
        <div class="hero-video col-1 no-margin">
          <video class="video-card-video" controls="true" id="${this.video.url_safe_id}" src="${this.video.link}"></video>
        </div>

        <div class="hero-sidebar col-fixed-4 no-margin">
          <h4 class="text-caption is-secondary is-uppercase">Top Labels</h4>
          <ul id="top-labels"></ul>
        </div>
      </header>

      <div class="announcement-bar sheet clearfix">
        <div class="l-left">
          <h3 class="text-title no-margin">${this.title}</h3>
          <p class="text-caption is-secondary no-margin" id="video-length">Length: ${this.videoLength}</p>
        </div>

        <button class="button l-right">
          <i class="material-icons">bookmark_border</i>
          Bookmark Video
        </button>
      </div>

      <article class="l-flex">
        <div id="graphs" class="col-1 l-pad-6 no-margin">
          Graphs
        </div>

        <asside id="related-videos" class="col-fixed-4 no-margin l-pad-3"></asside>
      </article>
    `;
  }

  destroy() {
    console.log('destroy page');
  }
}

export default VideoPage;