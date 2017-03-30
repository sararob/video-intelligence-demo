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

const HOST = `${window.location.protocol}//${window.location.host}`;

// Use VIDEO_DATA to specify readable titles and thumbnail images for your videos
const CONSTANTS = {
  VIDEO_API: `${HOST}/api/videos`,
  AUTH_API: `${HOST}/api/auth`,
  VIDEO_DATA: {
    'curling-webm':{
      'title':'Curling'
    },
    'airhockey-MOV':{
      'title':'Kid playing air hockey'
    },
    'trampoline-MOV':{
      'title':'Kid in a bounce house'
    },
    'google-duo-salt-pepper-mp4':{
      'title':'Google Duo | Salt & Pepper'
    },
    'data-center-mural-mp4':{
      'title':'Data Center Mural Project',
      'preview': '/images/preview/data-center.png',
      'thumbnail': '/images/thumbnails/data-center-thumbnail.png'
    },
    'google-earth-moon-mp4':{
      'title':'Moon in Google Earth',
      'preview': '/images/preview/moon-in-google-earth.png',
      'thumbnail': '/images/thumbnails/moon-in-google-earth.png'
    },
    'tango-commercial-mp4':{
      'title':'Tango: Re-imagine space around you'
    },
    'scuba-webm':{
      'title':'Scuba diving'
    },
    'google-trips-mp4':{
      'title':'Introducing Google Trips'
    },
    'flyboarding-webm':{
      'title':'Flyboarding'
    },
    'treehouse-tour-webm':{
      'title':'Treehouse Tour',
      'preview': '/images/preview/treehouse-tour.png',
      'thumbnail': '/images/thumbnails/treehouse-tour.png'
    },
    'jeff-dean-keynote-mov':{
      'title':'Jeff Dean at GCP Next 2016 Keynote',
    },
    'sandboarding-webm':{
      'title':'sandboarding-webm'
    },
    'pixel-glamping-mp4':{
      'title':'#Pixel: Glamping by Alisha Marie'
    },
    'snowglobe-mp4':{
      'title':'Google+ Snowglobe',
      'preview': '/images/preview/google-snowglobe.png',
      'thumbnail': '/images/thumbnails/google-snowglobe.png'
    },
    'nat-lo-recap-mp4':{
      'title':'Nat & Lo: 2016 Recap',
      'preview': '/images/preview/nat-and-lo.png',
      'thumbnail': '/images/thumbnails/nat-and-lo.png'
    },
    'truck_show-mov':{
      'title':'Family at a truck show'
    },
    'boumba-village-webm':{
      'title':'Marche de Boumba'
    },
    'barcelona-webm':{
      'title':'Barcelona',
      'preview': '/images/preview/barcelona.png',
      'thumbnail': '/images/thumbnails/barcelona.png'
    },
    'google-translate-spicy-mp4':{
      'title':'Google Demo Slam: Extra Spicy'
    },
    'google-home-superbowl-mp4':{
      'title':'Google Home | 2017 Superbowl Commercial'
    },
    'android-pay-mp4':{
      'title':'Android Pay Commercial'
    },
    'kennedy-nixon-1960-debate-mp4':{
      'title':'Kennedy & Nixon 1960 Presidential Debate'
    },
    'amsterdam-port-webm':{
      'title':'Amsterdam Port Time Lapse'
    },
    'basketball-webm':{
      'title':'Team USA Basketball Practice'
    },
    'eindhoven-webm':{
      'title':'DEZEEN AND MINI WORLD TOUR'
    },
    'larry-sergey-ice-bucket-challenge-mp4':{
      'title':'Larry and Sergey do the Ice Bucket Challenge',
      'preview': '/images/preview/larry-sergey-ice-bucket.png',
      'thumbnail': '/images/thumbnails/larry-sergey-ice-bucket.png'
    },
    'white-house-webm':{
      'title':'Tour of the White House'
    },
    'kid_toys-mov':{
      'title':'Kid playing with toys'
    },
    'fathers-day-mp4':{
      'title':'Google+: New Dad'
    },
    'google-photos-mp4':{
      'title':'Google Photos: Happier Holidays'
    },
    'charlie-chaplin-doodle-mp4':{
      'title':'Charlie Chaplin Google Doodle'
    },
    'mumbai-dancing-webm':{
      'title':'Mumbai Dancing',
      'preview': '/images/preview/mumbai-dancing.png',
      'thumbnail': '/images/thumbnails/mumbai-dancing.png'
    },
    'google-photos-space-mp4':{
      'title':'Google Photos: Extra Space'
    },
    'rio-ricardo-mp4':{
      'title':'Beyond the Map, Rio - Ricardo\'s Story'
    },
    'rio-paloma-mp4':{
      'title':'Beyond the Map, Rio - Paloma\'s Story'
    },
    'beyond-the-map-rio-mp4':{
      'title':'Beyond the Map, Rio'
    },
    'year-in-search-2014-mp4':{
      'title':'Year in Search 2014'
    },
    'hamilton-webm':{
      'title':'Hamilton cast performs at the White House',
      'preview': '/images/preview/hamilton-whitehouse.png',
      'thumbnail': '/images/thumbnails/hamilton-whitehouse.png'
    },
    'eating-habits-mp4':{
      'title':'Good Eating Habits',
      'preview': '/images/preview/good-eating-habits.png',
      'thumbnail': '/images/thumbnails/good-eating-habits-thumbnail.png'
    },
    'impact-challenge-india-mp4':{
      'title':'Impact Challenge: India',
      'preview': '/images/preview/impact-challenge-india.png',
      'thumbnail': '/images/thumbnails/impact-challenge-india.png'
    },
    'google-paris-office-mp4':{
      'title':'Tour of Google Paris'
    },
    'year-in-search-2016-mp4':{
      'title':'Year in Search 2016',
      'preview': '/images/preview/year-in-search.png',
      'thumbnail': '/images/thumbnails/year-in-search-thumbnail.png'
    },
    'onhub-kid-test-mp4':{
      'title':'OnHub Setup: Kid Test'
    },
    'iwd-2014-mp4':{
      'title':'International Women\'s Day 2014'
    },
    'year-in-search-2013-mp4':{
      'title':'Year in Search 2013',
      'preview': '/images/preview/year-in-search-2013.png',
      'thumbnail': '/images/thumbnails/year-in-search-2013.png'
    },
    'launchpad-jakarta-mp4':{
      'title':'Google Launchpad Jakarta'
    },
    'roller-derby-mp4':{
      'title':'Roller Derby'
    },
    'year-in-search-2015-mp4':{
      'title':'Year in Search 2015',
      'preview': '/images/preview/year-in-search-2015.png',
      'thumbnail': '/images/thumbnails/year-in-search-2015.png'
    },
    'national-parks-mp4':{
      'title':'Tour of National Parks'
    },
    'launchpad-bordeaux-mp4':{
      'title':'Google Launchpad Bordeaux'
    },
    'mothers-day-mp4':{
      'title':'Here\'s to the Moms'
    },
    'google-photos-automatic-backup-mp4':{
      'title':'Google Photos: Automatic Backup'
    },
    'google-photos-best-picture-mp4':{
      'title':'Google Photos: Best Picture'
    },
    'google-app-replacement-umpire-mp4':{
      'title':'Google App: Replacement Umpire'
    },
    'google-fiber-nicks-first-pitch-mp4':{
      'title':'Google Fiber: Nick\'s First Pitch',
      'preview': '/images/preview/google-fiber.png',
      'thumbnail': '/images/thumbnails/google-fiber.png'
    },
    'underwater-hangouts-on-air-mp4':{
      'title':'Underwater Hangouts On Air'
    },
    'my-tracks-fitness-tracker':{
      'title':'My Tracks Fitness Tracker'
    }
  }
};

export default  CONSTANTS;