'use strict';

const express = require('express');
const router = express.Router();

router.get('/video/:id', (req, res) => {
  res.render('video');
});

module.exports = router;