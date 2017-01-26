/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
const http = require('http');

const gcloud = require('google-cloud');
const datastore = gcloud.datastore({
  projectId: 'keynote-video-demo',
  keyFilename: 'datastore-keyfile.json'
});

const storage = gcloud.storage();

const base64 = require('node-base64-image');

const app = express();
app.enable('trust proxy');
// [END setup]

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);
const server = http.createServer(app);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/video', require('./routes/video'));

app.use(cors());

var videoData;

app.get('/getVideos', function(req, res) {
  var bucket = storage.bucket('keynote-videos');
  bucket.getFiles(function(err, files) {
    if (!err) {
      var fileArray = [];
      files.forEach(function(file, index) {

        var file = files[index];
        var key = datastore.key([file.metadata.bucket, file.metadata.name]);

        datastore.get(key, function(dsErr, entity) {
          if (!err) {
            fileArray.push({
              name: file.metadata.name,
              link: file.metadata.mediaLink,
              url_safe_id: (file.metadata.name).replace('/', '-').replace('.','-'),
              annotations: entity.data // TODO: Handle no data in Datastore yet
            });

            // Send the result if we've got all the videos
            if (fileArray.length == files.length) {

              videoData = fileArray;
              res.send(fileArray);
            }
          }
        });
      });
    } else {
      console.log('GCS error getting files', err);
    }
  });
});

app.get('/video/:id', function(req, res) {
  var vidId = req.params.id;
  var link;
  var annotations;
  for (var i in videoData) {
    var vid = videoData[i];
    // console.log(i);
    if (vid['url_safe_id'] == vidId) {
      link = vid['link'];
    }
  }
  // TODO make the d3 graph and pass it to the client

  res.render('video', {link: link, annotations: annotations});
});


app.get('/search/:term?', function(req, res) {
  var term = req.query.term.toLowerCase();
  var matchingVids = [];


  for (var i in videoData) {
    var video = videoData[i];
    var annotations = video.annotations[0]['annotations'];
    var match = {
      'name': video['url_safe_id'],
      'link': video['link'],
      'seconds': []
    }
    annotations.forEach(function(annotation, index) {
      var name = annotation['description'].toLowerCase();
      if ((name == term) && (annotation['timeOffset'] != -1) && (annotation['timeOffset'])) { // It's a match! Add it
        var millisecond = annotation['timeOffset'] / 1000;
        match['seconds'].push(millisecond);
      }
    });
    if (match['seconds'].length != 0) {
      matchingVids.push(match);
    }
  }

  res.render('search', {vids: matchingVids, term: term});
});

// Moved this to a Cloud Function
// app.post('/video', function(req, res) {


//   // 1) Kick off the annotation request (v1alpha1)
//   var requestBody = {
//     "gcs_content_uri": req.body.url,
//     "annotation_types": "LABEL_DETECTION"
//   }

//   var options = {
//     url: "https://videointelligence.googleapis.com/v1alpha1/videos:annotate?key=AIzaSyBMXGMEKJZblpSgvFdE1OhoIICT8E1yEoY",
//     method: "POST",
//     body: requestBody,
//     json: true
//   }

//   // 2) Get the status of the annotations
//   request(options, function(err, resp, body) {
//     console.log(body);
//     if (!err && resp.statusCode == 200) {
//       if (body.name) {
//         var opId = body.name;

//         var operationReq = {
//           url: "https://videointelligence.googleapis.com/v1/operations/" + opId + "?key=AIzaSyBMXGMEKJZblpSgvFdE1OhoIICT8E1yEoY",
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }

//         console.log(body['name']);

//         // var results = makeSecondVideoRequest(operationReq);
//         var requestInterval = setInterval(function() {
//           request(operationReq, function (error, response, annotationBody) {

//             var annotationJSON = JSON.parse(annotationBody);

//             if (annotationJSON.done === true) {
//               res.status(200).send(annotationJSON);
//               clearInterval(requestInterval);
//             } else {
//               console.log('still waiting...');
//               console.log(annotationBody);
//             }

//           });

//         }, 5000);


//       }
//     } else { // Invalid GCS URI
//       res.status(400).send("GCS file not found. Please try again.");
//     }
//   });



// });

module.exports = app;
