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

// [START app]
'use strict';

// [START setup]
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const storage = require('@google-cloud/storage');
const config = require('./local.json');
const storageClient = storage({projectId: config.cloud_project_id, keyfileName: "keyfile.json"});
const app = express();
const port = normalizePort(process.env.PORT || 3000);


/*
* Port Settings
*
*/

app.enable('trust proxy');
app.set('port', port);

function normalizePort(val) {
  const port = parseInt(val, 10);

  // NAMED PORT
  if (isNaN(port)) {
    return val;
  }

  // CUSTOM PORT
  if (port >= 0) {
    return port;
  }

  return false;
}


/*
* View Engine
*
*/

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


/*
* Middleware
*
*/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


/*
* API Route for Video Data
*
*
*/

app.get('/api/videos', (req, res) => {
  const storageBucket = storageClient.bucket(config.video_bucket);

  storageBucket.getFiles(function(err, files) {
    if (!err) {
      let fileArray = [];

      files.forEach(function(file) {
        const videoAnnotationBucket = storageClient.bucket(config.video_json_bucket);
        const videoAnnotationFilename = (file.metadata.name).replace('/', '').replace('.', '') + '.json';
        const annotationFile = videoAnnotationBucket.file(videoAnnotationFilename);

        // GET ANNONATIONS FOR EACH FILE
        annotationFile.get(function(error, fileData) {
          if (error) {
            console.log('error getting file', error);
          }
          else {
            const remoteJsonUrl = fileData.metadata.mediaLink;
            console.log(fileData.metadata);

            request({
              url: remoteJsonUrl,
              json: true
            },
            function(jsonReadErr, jsonResp, body) {
              if (!jsonReadErr) {
                fileArray.push({
                  name: file.metadata.name,
                  link: file.metadata.mediaLink,
                  url_safe_id: (file.metadata.name).replace('/', '-').replace('.','-'),
                  annotations: body.annotation_results[0]
                });

                // RETURN PAYLOAD
                if (fileArray.length == files.length) {
                  res.send(fileArray);
                }
              }
            });
          }
        });
      });
    }
    else {
      console.log('GCS error getting files', err);
    }
  });
});


/*
* Route for all other pages
*
*
*/

app.use('*', require('./routes/index'));

module.exports = app;
