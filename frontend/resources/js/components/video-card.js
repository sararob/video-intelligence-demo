// Copyright 2017 Google Inc.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import _ from 'lodash';
import {VIDEO_DATA} from '../constants';




export default function(video, query, expanded) {
  const title = VIDEO_DATA[video.url_safe_id] ? VIDEO_DATA[video.url_safe_id].title : _.capitalize(video.name.replace(/(\-)|(\_)|(\.mov|.mp4|.webm)/gi, ' ').trim());
  const tags = video.annotations.label_annotations.map(label => label.description).join(', ');
  const preview = VIDEO_DATA[video.url_safe_id].thumbnail ? `poster="${VIDEO_DATA[video.url_safe_id].thumbnail}"` : '';

  // DEFAULT VALUES
  let header = `<h3 class="text-body">${title}</h3>`;
  let selectedTags = tags.length > 90 ? `${tags.substring(0,90)}...` : tags;
  let isExpanded = '';

  // UPDATE ELEMENTS FOR EXANDED VIDEO CARD
  if(expanded) {
    header = `<h3 class="text-title">${title}</h3>`;
    isExpanded = 'is-expanded';
    selectedTags = tags.length > 230 ? `${tags.substring(0,230)}...` : tags;
  }

  // RETURN VIDEO CARD ELEMENT
  return `
    <a href="/video/${video.url_safe_id}" class="video-card ${isExpanded}" data-navigo>
      <div class="video-card-hero">
        <video class="video-card-video" ${preview} preload="metadata" id="${video.url_safe_id}" src="${video.link}"></video>
      </div>
      ${header}
      <div class="video-card-graph"></div>
      <p class="text-caption is-secondary">${selectedTags}</p>
    </a>
  `;
}