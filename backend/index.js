const datastore = require('@google-cloud/datastore');
const datastoreClient = datastore({
  projectId: 'keynote-video-demo',
  keyfileName: 'keyfile.json'
});
const request = require('request');

const storage = require('@google-cloud/storage');
const storageClient = storage({
  projectId: 'keynote-video-demo',
  keyfileName: 'keyfile.json'
});

const allowedFileTypes = ["mp4", "mpeg4", "avi", "webm", "mov"];
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
      var apiKey = 'AIzaSyBMXGMEKJZblpSgvFdE1OhoIICT8E1yEoY';

      google.discoverAPI({
       url: url,
       version: 'v1beta1',
       key: apiKey
      }, function (serviceErr, videoService) {
        console.log("filename is " + fileName);
       // use the service
        const requestBody = {
          "auth": "AIzaSyBMXGMEKJZblpSgvFdE1OhoIICT8E1yEoY",
          "resource": {
            "gcsInputUri": videoFilename,
            "gcsOutputUri": "gs://video-json-output/" + fileName.replace(".", "").replace("/", "") + ".json",
            'spec': {
              'annotationTypes': ['LABEL_DETECTION', 'FACE_DETECTION', 'SHOT_CHANGE_DETECTION']
            }
          }
        }

        // 2) Get the status of the annotations (v1)
        videoService.videos.annotate(requestBody, function(error, resp) {
          const opId = resp.name;
          console.log(opId);

          var requestInterval = setInterval(function() {
            google.discoverAPI({
              url: url,
              version: 'v1',
              key: apiKey
            }, function(serviceErr, videoIntelligence) {
              const reqBody = {
                "auth": "AIzaSyBMXGMEKJZblpSgvFdE1OhoIICT8E1yEoY",
                "name": opId
              }
              videoIntelligence.operations.get(reqBody, function (opErr, opResp) {
                if (!opErr) {
                  if (opResp['response']['annotationResults']) {
                    const annotations = opResp['response']['annotationResults'];
                    console.log('got the annotations!', annotations);
                    // writeToDatastore(bucketName, fileName, annotations);
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

function writeToDatastore(bucket, videoName, annotations) {
	const key = datastoreClient.key([bucket, videoName]);
  console.log('writing to ds', annotations);
	const data = {
		key: key,
		data: annotations
	};
	datastoreClient.save({
		key: key,
		data: data
	}, function (err) {
		if (!err) {
      // Data saved
      console.log('written to datastore');
		} else {
      console.log('datastore error', err)
    }
	});
}