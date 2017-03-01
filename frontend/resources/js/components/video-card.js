import _ from 'lodash';
import {VIDEO_DATA} from '../constants';


function renderTimeline(locations) {
  let segments = [];

  for (var i = 0; i < locations.length; i++) {
    let type = locations[i].level;
    let segment = locations[i].segment;

    if(type === 'SHOT_LEVEL') {
      segments.push(createSegment(segment));
    }
  }

  return `<div class="graph">${segments.join('')}</div>`;
}

function createSegment(segment) {
  const hasStartAndEnd = segment.start_time_offset && segment.end_time_offset;
  let segmentEl = '';
  const videoDuration = 100;

  if(hasStartAndEnd) {
    const start = segment.start_time_offset / 1000000;
    const end = segment.end_time_offset / 1000000;

    const left = (start / videoDuration) * 100;
    const right = 100 - ((end / videoDuration) * 100);

    segmentEl = `<div class="graph-segment" style="left: ${left.toFixed(2)}%; right: ${right.toFixed(2)}%;" data-time="${start}"></div>`;
  }

  return segmentEl;
}



export default function(video, query, expanded) {
  const title = VIDEO_DATA[video.url_safe_id] ? VIDEO_DATA[video.url_safe_id].title : _.capitalize(video.name.replace(/(\-)|(\_)|(\.mov|.mp4|.webm)/gi, ' ').trim());
  const tags = video.annotations.label_annotations.map(label => label.description).join(', ');
  const label = _.find(video.annotations.label_annotations, (label) => {
    return _.toLower(label.description) === _.toLower(query);
  });


  // DEFAULT VALUES
  let header = `<h3 class="text-body">${title}</h3>`;
  let selectedTags = tags.length > 90 ? `${tags.substring(0,90)}...` : tags;
  let graph = '';
  let isExpanded = '';

  // UPDATE ELEMENTS FOR EXANDED VIDEO CARD
  if(expanded) {
    header = `<h3 class="text-title">${title}</h3>`;
    graph = `<span class="text-caption-2">${query}</span> ${renderTimeline(label.locations)}`;
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