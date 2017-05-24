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

const config = require('./local.json')

const storage = require('@google-cloud/storage');
const storageClient = storage({
  projectId: config.cloud_project_id,
  keyfileName: "keyfile.json"
});

const video = require('@google-cloud/video-intelligence');
const videoClient = video({
  projectId: config.cloud_project_id,
  keyfileName: "keyfile.json"
});


const allowedFileTypes = ["mp4", "mpeg4", "avi", "webm", "mov", "mpg"];


exports.analyzeVideo = function analyzeVideo (event, callback) {
  const file = event.data;
  const isDelete = file.resourceState === 'not_exists';

  if (isDelete) {
    console.log(`File ${file.name} deleted.`);
  } else {
    const bucketName = file.bucket;
    console.log('fileinfo: ',file);
    const fileName = file.name;
    const fileType = fileName.split('.').pop();


    if (allowedFileTypes.indexOf(fileType.toLowerCase()) != -1) {
      // it's a video!
      const request = {
        inputUri: "gs://" + bucketName + '/' + fileName;,
        outputUri: "gs://" + config.video_json_bucket + "/" + fileName.replace(".", "").replace("/", "") + ".json",
        features: ['LABEL_DETECTION', 'SHOT_CHANGE_DETECTION']
      }

      videoClient.annotateVideo(request).then(function(responses) {
        var operation = responses[0];
        operation.on('complete', function(result, metadata, finalResponse) {
          console.log('got the annotations: ',result);
        });

        operation.on('progress', function(metadata,apiResp) {
          console.log('processing: ', metadata);
        });

        operation.on('error', function(err) {
          console.log('error: ', err);
        });
      });

    } else {
      console.log(videoFilename + " is not a video file.")
    }

  }
}