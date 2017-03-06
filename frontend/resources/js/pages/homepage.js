import store from 'store';

import VideoCard from '../components/video-card';

class HomePage {
  constructor(stage, router) {
    this.$stage = stage;
    this.router = router;

    this.render();
    this.router.updatePageLinks();
    return this;
  }

  destroy() {
    // console.log('destroy page');
  }

  template(videos) {
    return `
      <div class="l-flex-wrap l-pad-6">
      ${videos}
      </div>
    `;
  }

  render() {
    const videos = store.get('videos');
    const videoCards = videos.map((video) => VideoCard(video)).join('');

    this.$stage.html(this.template(videoCards));
  }
}

export default HomePage;