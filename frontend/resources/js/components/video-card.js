import _ from 'lodash';

export default function(video) {
  const title = _.capitalize(video.name.replace(/(\-)|(\_)|(\.mov|.mp4|.webm)/gi, ' ').trim());

  return `
    <a href="/video/${video.url_safe_id}" class="video-card" data-navigo>
      <div class="video-card-hero">
        <video class="video-card-video" preload="metadata" id="${video.url_safe_id}" src="${video.link}"></video>
      </div>
      <p class="text-body">${title}</p>
      <p class="text-caption is-secondary">${video.name}</p>
    </a>
  `;
}
