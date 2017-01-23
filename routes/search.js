'use strict';

const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/search/:term', (req, res) => {
	// console.log(req, 'weee');
	res.render('search');
});

module.exports = router;