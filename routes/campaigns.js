const express                = require('express');
const moment                 = require('moment');
const Campaign               = require('../models/campaign');
const TYPES                  = require('../models/campaign-types');
const { ensureLoggedIn }     = require('connect-ensure-login');
const {
  authorizeCampaign,
  checkOwnership
  }                          = require('../middleware/campaign-middleware');
const router  = express.Router();


router.get('/new', ensureLoggedIn('/login'), (req, res, next) => {
  res.render('campaigns/new', { types: TYPES });
});

router.post('/', ensureLoggedIn('/login'), (req, res, next) => {
  const newCampaign = new Campaign({
    title: req.body.title,
    goal: req.body.goal,
    description: req.body.description,
    category: req.body.category,
    deadline: req.body.deadline,
    creator: req.user._id
  });

  newCampaign.save( (err) => {
    if (err) {
      res.render('campaigns/new', { campaign: newCampaign, types: TYPES });
    } else {
      res.redirect(`/campaigns/${newCampaign._id}`);
    }
  });
});

router.get('/:id', ensureLoggedIn('/login'), checkOwnership, (req, res, next) => {
  Campaign.findById(req.params.id, (err, campaign) => {
    if (err){ return next(err); }

    campaign.populate('creator', (err, campaign) => {
      if (err){ return next(err); }

      return res.render('campaigns/show', { campaign });
    });

  });
});

router.get('/:id/edit',
  [
    ensureLoggedIn('/login'),
    authorizeCampaign,
  ],
  (req, res, next) => {
  Campaign.findById(req.params.id, (err, campaign) => {
    if (err)       { return next(err) }
    if (!campaign) { return next(new Error("404")) }

    let campaignDate = moment(campaign.deadline).format('YYYY-MM-DD');
    return res.render('campaigns/edit', { campaign, campaignDate, types: TYPES })
  });
});

router.post('/:id',
  [
    ensureLoggedIn('/login'),
    authorizeCampaign
  ],
  (req, res, next) => {
  const updates = {
    title: req.body.title,
    goal: req.body.goal,
    description: req.body.description,
    category: req.body.category,
    deadline: req.body.deadline
  };

  Campaign.findByIdAndUpdate(req.params.id, updates, (err, campaign) => {
    if (err)       { return res.render('campaigns/edit', { campaign, errors: campaign.errors }); }
    if (!campaign) { return next(new Error("404")); }
    return res.redirect(`/campaigns/${campaign._id}`);
  });
});

module.exports = router;
