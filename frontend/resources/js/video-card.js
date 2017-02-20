const VideoCard = function(video) {
  return `
    <a href="/video/${video.id}" class="video-card">
      <video class="video-card-video" id="${video.id}" src="${video.link}"></video>
      <p>${video.name}</p>
    </a>
  `;
};

export default VideoCard;