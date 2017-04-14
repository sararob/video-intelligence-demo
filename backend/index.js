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

const request = require('request');
const config = require('./local.json')

const storage = require('@google-cloud/storage');
const storageClient = storage({
  projectId: config.cloud_project_id,
  keyfileName: "keyfile.json"
});

const allowedFileTypes = ["mp4", "mpeg4", "avi", "webm", "mov", "mpg"];
const google = require('googleapis');


exports.analyzeVideo = function analyzeVideo (event, callback) {
  const file = event.data;
  const isDelete = file.resourceState === 'not_exists';

  if (isDelete) {
    console.log(`File ${file.name} deleted.`);
    // TODO - also delete the entity from Datastore
  } else {
    const bucketName = file.bucket;
    console.log('fileinfo: ',file);
    const fileName = file.name;
    const videoFilename = "gs://" + bucketName + '/' + fileName;
    console.log(videoFilename);

    const fileType = fileName.split('.').pop();
    if (allowedFileTypes.indexOf(fileType.toLowerCase()) != -1) {
      // it's a video!

      // 1) Kick off the annotation request (v1alpha1)
      var url = 'https://videointelligence.googleapis.com/$discovery/rest'
      var apiKey = config.video_api_key;

      google.discoverAPI({
       url: url,
       version: 'v1beta1',
       key: apiKey
      }, function (serviceErr, videoService) {
        console.log("filename is " + fileName);
       // use the service
        const requestBody = {
          "auth": config.video_api_key,
          "resource": {
            "inputUri": videoFilename,
            "outputUri": "gs://" + config.video_json_bucket + "/" + fileName.replace(".", "").replace("/", "") + ".json",
            'features': ['LABEL_DETECTION', 'SHOT_CHANGE_DETECTION']
          }
        }

        // 2) Get the status of the annotations (v1)
        videoService.videos.annotate(requestBody, function(error, resp) {
          console.log(error);
          const opId = resp.name;
          console.log(opId);

          var requestInterval = setInterval(function() {
            google.discoverAPI({
              url: url,
              version: 'v1',
              key: apiKey
            }, function(serviceErr, videoIntelligence) {
              const reqBody = {
                "auth": config.video_api_key,
                "name": opId
              }
              videoIntelligence.operations.get(reqBody, function (opErr, opResp) {
                if (!opErr) {
                  if (opResp['response']['annotationResults']) {
                    const annotations = opResp['response']['annotationResults'];
                    console.log('got the annotations!', annotations);
                    clearInterval(requestInterval);
                  } else {
                    console.log('still waiting...', opResp);
                    console.log('progress', opResp['metadata']['annotationProgress']);
                  }
                } else {
                  console.log('error analyzing video', opErr);
                }
              });
            })
          }, 5000);

        });
      });

    } else {
      console.log(videoFilename + " is not a video file.")
    }

  }
}