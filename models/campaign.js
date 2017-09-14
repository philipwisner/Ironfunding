const mongoose = require('mongoose');
const TYPES    = require('./campaign-types');
const Reward   = require('./reward');
const moment   = require('moment');
const Schema   = mongoose.Schema;

const CampaignSchema = new Schema({
  title         : { type: String, required: true },
  description   : { type: String, required: true },
  category      : { type: String, enum: TYPES, required: true },
  creator       : { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goal          : { type: Number, required: true },
  image         : {
    type: String,
    default: "https://placeholdit.imgix.net/~text?txtsize=33&txt=500x500&w=500&h=500"
  },
  backerCount   : { type: Number, default: 0 },
  totalPledged  : { type: Number, default: 0 },
  rewards       : [ { type: Schema.Types.ObjectId, ref: 'Reward' } ],
  deadline      : { type: Date, required: true },
});

CampaignSchema.methods.belongsTo = function(user){
  return this.creator.equals(user._id);
}

CampaignSchema.virtual('timeRemaining').get(function(){
  let remaining = moment(this.deadline).fromNow(true).split(' ');
  let [days, unit] = remaining;
  return { days, unit };
});

CampaignSchema.virtual('inputFormattedDate').get(function(){
  return moment(this.deadline).format('YYYY-MM-DD');
});

module.exports = mongoose.model('Campaign', CampaignSchema);
