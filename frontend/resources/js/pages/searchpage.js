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

    console.log(results);
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
    }
    else {
      this.renderNoResults();
    }

    // UPDATE ROUTER LINKS
    this.router.updatePageLinks();
  }

  renderResultCards() {
    const videos = this.results.map((video) => VideoCard(video, true));
    this.$results.append(videos);
  }

  renderNoResults() {
    this.$results.html('<p class="body-text">No results</p>');
  }

  template() {
    return `
      <article class="l-flex-fullscreen l-pinned">
        <div id='results' class="col-1 l-pad-horizontal-5 l-pad-vertical-12 l-overflow"></div>
        <aside id="sidebar" class="col-fixed-4 fill-subtle  l-overflow"></aside>
      </article>
    `;
  }

  destroy() {
    console.log('destroy page');
  }
}

export default SearchPage;