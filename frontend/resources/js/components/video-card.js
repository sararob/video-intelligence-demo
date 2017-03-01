import _ from 'lodash';

export default function(video, expanded) {
  const title = _.capitalize(video.name.replace(/(\-)|(\_)|(\.mov|.mp4|.webm)/gi, ' ').trim());
  const tags = video.annotations.label_annotations.map(label => label.description).join(', ');

  // DEFAULT VALUES
  let header = `<h3 class="text-body">${title}</h3>`;
  let selectedTags = tags.length > 90 ? `${tags.substring(0,90)}...` : tags;
  let graph = '';
  let isExpanded = '';

  // UPDATE ELEMENTS FOR EXANDED VIDEO CARD
  if(expanded) {
    header = `<h3 class="text-title">${title}</h3>`;
    graph = '<div class="video-card-graph"></div>';
    isExpanded = 'is-expanded';
    selectedTags = tags.length > 230 ? `${tags.substring(0,230)}...` : tags;
  }

  // RETURN VIDEO CARD ELEMENT
  return `
    <a href="/video/${video.url_safe_id}" class="video-card ${isExpanded}" data-navigo>
      <div class="video-card-hero">
        <video class="video-card-video" preload="metadata" id="${video.url_safe_id}" src="${video.link}"></video>
      </div>
      ${header}
      ${graph}
      <p class="text-caption is-secondary">${selectedTags}</p>
    </a>
  `;
}