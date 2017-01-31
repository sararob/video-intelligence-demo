# Video API Demo

This repo is split into 2 parts:

* **Frontend**: App Engine app that displays videos and their Video API annotations, lets you search videos by annotation
* **Backend**: Google Cloud Function that calls the Video API everytime a new video is added to the `keynote-videos` bucket. It stores the JSON response output in the `video-json-output` bucket.