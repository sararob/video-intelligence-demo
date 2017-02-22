import _ from 'lodash';

const VideoCard = function(video) {
  return `
    <a href="/video/${video.url_safe_id}" class="video-card" data-navigo>
      <video class="video-card-video" id="${video.url_safe_id}" src="${video.link}"></video>
      <p>${video.name}</p>
    </a>
  `;
};

export default VideoCard;