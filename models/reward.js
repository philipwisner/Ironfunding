const mongoose = require('mongoose');
const User     = require('./user');
const Campaign = require('./campaign');
const Schema   = mongoose.Schema;

const RewardSchema = new Schema({
  title      : { type: String, required: true },
  description: { type: String, required: true },
  amount     : { type: Number, required: true, min: 0 },
  delivery   : { type: Date, required: true },
  _campaign  : { type: Schema.Types.ObjectId, ref: 'Campaign' },
  bidders    : [ { type: Schema.Types.ObjectId,  ref: 'User' } ]
});

RewardSchema.methods.registerWithCampaign = function(amount, cb){
  const campaignId = this._campaign;
  mongoose.models.Campaign.findByIdAndUpdate(campaignId, {
    $inc: { totalPledged: amount, backerCount: 1 }
    }, (err) => {
    if (!err){
      return cb()
    } else {
      return cb(err);
    }
  })
}

RewardSchema.methods.biddedOnBy = function(user){
  return this.bidders.some(bidderId => bidderId.equals(user._id));
}

const Reward = mongoose.model('Reward', RewardSchema);

module.exports = Reward;
