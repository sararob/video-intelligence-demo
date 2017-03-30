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

import $ from 'jquery';
import store from 'store';
import _ from 'lodash';
import VideoCard from '../components/video-card';


class SearchPage {
  constructor(stage, router, query) {
    this.$stage = stage;
    this.router = router;
    this.query = query;
    this.videos = store.get('videos');
    this.results = this.getSearchResults();
    this.results = _.sortBy(this.results, ['name']);


    this.render();
    return this;
  }

  getSearchResults() {
    const results = _.filter(this.videos, (video) => {
      const labels = video.annotations.label_annotations;

      const hasQuery = _.find(labels, (label) => {
        return _.toLower(label.description) === _.toLower(this.query);
      });

      // CONTAINS QUERY LABEL
      if(hasQuery) {
        return true;
      }
      else {
        return false;
      }
    });

    return results;
  }

  render() {
    // INJECT TEMPLATE
    this.$stage.html(this.template());

    // REGISTER TEMPLATE ELEMENTS
    this.$results = $('#results');
    this.$sidebar = $('#sidebar');

    if(this.results.length) {
      this.renderResultCards();
      this.renderGraphs();
    }
    else {
      this.renderNoResults();
    }


    // UPDATE ROUTER LINKS
    this.router.updatePageLinks();
  }

  renderGraphs() {
    const that = this;

    $('.video-card-video').on('loadedmetadata', function() {
      let isPlaying = false;

      const $video = $(this);
      const key = $video.attr('id');
      const duration = this.duration;
      const videoData = _.find(that.videos, {url_safe_id: key});

      // ADD STOP AND START TO VIDEO
      $video.on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(isPlaying) {
          this.pause();
          isPlaying = false;
        }
        else {
          this.play();
          isPlaying = true;
        }
      });

      const label = _.find(videoData.annotations.label_annotations, (label) => {
        return _.toLower(label.description) === _.toLower(that.query);
      });

      const timeline = that.renderTimeline(label.locations, duration);
      // INSERT VIDEO

      const $videoContainer = $video.parent().parent().find('.video-card-graph');
      $videoContainer.append(`<div class="text-caption-2 no-margin">${that.query}</div>`);
      $videoContainer.append(timeline);

      $videoContainer.find('.graph-segment').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startTime = $(e.currentTarget).data('time');

        $video[0].currentTime = startTime;
        $video[0].play();
        isPlaying = true;
      });
    });
  }

  renderTimeline(locations, duration) {
    let segments = [];

    for (var i = 0; i < locations.length; i++) {
      let type = locations[i].level;
      let segment = locations[i].segment;

      if(type === 'SHOT_LEVEL') {
        segments.push(this.createSegment(segment, duration));
      }
    }

    return `<div class="graph">${segments.join('')}</div>`;
  }

  createSegment(segment, duration) {
    let segmentEl = '';


    const start = segment.start_time_offset ? (segment.start_time_offset / 1000000) : 0;
    const end = segment.end_time_offset / 1000000;

    const left = (start / duration) * 100;
    const right = 100 - ((end / duration) * 100);

    segmentEl = `<a href="#" class="graph-segment" style="left: ${left.toFixed(2)}%; right: ${right.toFixed(2)}%;" data-time="${start}"></a>`;

    return segmentEl;
  }

  renderResultCards() {
    const videos = this.results.map((video) => VideoCard(video, this.query, true));
    this.$results.append(videos);
  }

  renderNoResults() {
    this.$results.html('<p class="body-text">No results</p>');
  }

  template() {
    return `
      <article class="l-flex-fullscreen l-pinned">
        <div id='results' class="col-1 l-pad-horizontal-5 l-pad-vertical-12 l-overflow">
          <h2 class="text-title is-uppercase no-margin">RESULTS FOR ${this.query}</h2>
          <p class="text-body is-secondary is-uppercase">${this.results.length} videos</p>
        </div>
        <aside id="sidebar" class="col-fixed-4 fill-subtle  l-overflow"></aside>
      </article>
    `;
  }

  destroy() {
    $('.video-card-video').off();
  }
}

export default SearchPage;