export default function(video) {
  return `
    <a href="/video/${video.url_safe_id}" class="video-card" data-navigo>
      <div class="video-card-hero">
        <video class="video-card-video" id="${video.url_safe_id}" src="${video.link}"></video>
      </div>
      <p class="text-body is-secondary">${video.name}</p>
      <p class="text-caption is-secondary">${video.name}</p>
    </a>
  `;
}