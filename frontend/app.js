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
const storageClient = storage({projectId: 'keynote-video-demo', keyfileName: 'keyfile.json'});
const app = express();
const port = normalizePort(process.env.PORT || 3000);
const basicAuth = require('express-basic-auth');


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
* Basic Authentication
*
*/

app.use(basicAuth({
  users: {
    'alexanderhamilton': 'myshot'
  },
  challenge: true
}));


/*
* API Route for Video Data
*
*
*/

app.get('/api/videos', (req, res) => {
  const storageBucket = storageClient.bucket('keynote-videos');

  storageBucket.getFiles(function(err, files) {
    if (!err) {
      let fileArray = [];

      files.forEach(function(file) {
        const videoAnnotationBucket = storageClient.bucket('video-json-output');
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


// app.get('/video/:id', function(req, res) {
//   var vidId = req.params.id;
//   var link;
//   var labelAnnotations, faceAnnotations;
//   var id;
//   for (var i in videoData) {
//     var vid = videoData[i];
//     if (vid['url_safe_id'] == vidId) {
//       link = vid['link'];
//       id = vid['url_safe_id']
//       var annotations = vid['annotations']['annotation_results'][0];
//       var labelAnnotations = annotations['label_annotations'];
//       var faceAnnotations = annotations['face_annotations'];
//     }
//   }
//   // res.send(labelAnnotations, faceAnnotations);
//   res.render('video', {link: link, labelAnnotations: labelAnnotations, faceAnnotations: faceAnnotations, id: id});
// });


// app.get('/search/:term?', function(req, res) {
//   var term = req.query.term.toLowerCase();
//   var matchingVids = [];


//   for (var i in videoData) {
//     var video = videoData[i];
//     var vidAnnotations = video['annotations']['annotation_results'];
//     // console.log(vidAnnotations);

//     var match = {
//       'name': video['url_safe_id'],
//       'link': video['link'],
//       'seconds': []
//     }

//     // var vidAnnotations = video['annotations']['v1beta1']['annotation_results'][0];
//     var labelAnnotations = vidAnnotations[0]['label_annotations'];


//     for (var j in labelAnnotations) {
//       var label = labelAnnotations[j];
//       // console.log(label);
//       var description = label['description'];

//       if (description) {
//         if (description.toLowerCase() == term) {
//           // Get the time
//           var locations = label['locations'];
//           // console.log(locations);
//           for (var k in locations) {
//             var segment = locations[k];
//             var startTime = segment['segment']['start_time_offset'];
//             var endTime = segment['segment']['end_time_offset'];
//             if (startTime != -1) {
//               var range = [startTime / 1000000 || 0, endTime / 1000000]
//               match['seconds'].push(range);
//             }
//           }
//         }
//       } else {
//         console.log('no_description', label);
//       }

//     }

//     if (match['seconds'].length != 0) {
//       matchingVids.push(match);
//     }
//   }

//   res.render('search', {vids: matchingVids, term: term});
// });

module.exports = app;
