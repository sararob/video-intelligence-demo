import $ from 'jquery';
import store from 'store';
import _ from 'lodash';

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
    this.$stage.html(this.template);

    // REGISTER TEMPLATE ELEMENTS
    this.$results = $('#results');
    this.$sidebar = $('#sidebar');

    // RENDER CONTENT
    this.renderResultCards();

    // UPDATE ROUTER LINKS
    this.router.updatePageLinks();
  }

  renderResultCards() {

  }

  template() {
    return `
      <article class="l-flex-fullscreen l-pinned">
        <div id='results' class="col-1 l-pad-5">
          <!-- VIDEO RESULTS -->
        </div>

        <aside id="sidebar" class="col-fixed-4 fill-subtle"></aside>
      </article>
    `;
  }

  destroy() {
    console.log('destroy page');
  }
}

export default SearchPage;