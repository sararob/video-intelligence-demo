import _ from 'lodash';

export default function(video, expanded) {
  const title = _.capitalize(video.name.replace(/(\-)|(\_)|(\.mov|.mp4|.webm)/gi, ' ').trim());
  let header = `<p class="text-body">${title}</p>`;
  let graph = '';
  let isExpanded = '';

  // UPDATE ELEMENTS FOR EXANDED VIDEO CARD
  if(expanded) {
    header = `<h3 class="text-title">${title}</h3>`;
    graph = '<div class="video-card-graph">Create Graph</div>';
    isExpanded = 'is-expanded';
  }

  // RETURN VIDEO CARD ELEMENT
  return `
    <a href="/video/${video.url_safe_id}" class="video-card ${isExpanded}" data-navigo>
      <div class="video-card-hero">
        <video class="video-card-video" preload="metadata" id="${video.url_safe_id}" src="${video.link}"></video>
      </div>
      ${header}
      ${graph}
      <p class="text-caption is-secondary">${video.name}</p>
    </a>
  `;
}
