const express = require('express');
const Campaign = require('../models/campaign');
const router  = express.Router();

router.get('/', (req, res, next) => {
  Campaign
    .find({})
    .populate('creator')
    .exec( (err, campaigns) => {
        res.render('index', { campaigns });
    });
});

module.exports = router;
