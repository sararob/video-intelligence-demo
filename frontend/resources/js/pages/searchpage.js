import $ from 'jquery';
import store from 'store';


class SearchPage {
  constructor(stage, router, query) {
    this.$stage = stage;
    this.router = router;
    this.query = query;
    this.videos = store.get('videos');

    this.render();
    this.router.updatePageLinks();
    return this;
  }

  render() {

    this.$stage.html(this.query);
  }



  template(videos) {
    return `
      <div class="l-flex-wrap l-pad-6">
      ${videos}
      </div>
    `;
  }

  destroy() {
    console.log('destroy page');
  }
}

export default SearchPage;