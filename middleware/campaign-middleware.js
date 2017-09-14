const Campaign = require('../models/campaign.js');

function authorizeCampaign(req, res, next){
  Campaign.findById(req.params.id, (err, campaign) => {
    if (err){ return next(err) }
    if (!campaign){ return next(new Error('404')) }

    if (campaign.belongsTo(req.user)){
      return next()
    } else {
      return res.redirect(`/campaigns/${campaign._id}`)
    }
  });
}

function checkOwnership(req, res, next){
  Campaign.findById(req.params.id, (err, campaign) => {
    if (err){ return next(err) }
    if (!campaign){ return next(new Error('404')) }

    if (campaign.belongsTo(req.user)){
      res.locals.campaignIsCurrentUsers = true;
    } else {
      res.locals.campaignIsCurrentUsers = false;
    }
    return next()
  });
}

module.exports = {
  authorizeCampaign,
  checkOwnership
}
