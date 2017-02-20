# Video API Demo

This repo is split into 2 parts:

### FRONTEND
- **Frontend**: App Engine app that displays videos and their Video API annotations, lets you search videos by annotation

#### TECH STACK
- [jQuery](http://api.jquery.com/on/)
- ES6 
- [Sass](http://sass-lang.com/)
- [Local Storage](https://www.npmjs.com/package/store)
- [lodash](https://lodash.com/docs/4.17.4#trim)
- [Navigo (Routing)](https://github.com/krasimir/navigo)
- [Canavsjs](http://canvasjs.com/docs/charts/basics-of-creating-html5-chart/event-handling/)
- [Webpack - JS Compilation](https://webpack.github.io/)
- [Gulp - Build Process](http://gulpjs.com/) 

### BACKEND
- Google Cloud Function that calls the Video API everytime a new video is added to the `keynote-videos` bucket.
- It stores the JSON response output in the `video-json-output` bucket.