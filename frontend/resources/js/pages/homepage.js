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