import $ from 'jquery';
import store from 'store';


import VideoCard from '../components/video-card';


class HomePage {
  constructor(stage, router) {
    this.$stage = stage;
    this.router = router;


    this.render();
    return this;
  }

  destroy() {
    console.log('destroy page');
  }

  render() {
    const videos = store.get('videos');

    for(var i = 0, l = videos.length; i < l; i++) {
      this.$stage.append(VideoCard(videos[i]));
    }
  }
}

export default HomePage;