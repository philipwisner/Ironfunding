function campBelongsToUser(req, res, next){
  if (req.user._id.toString() === req.params.id){
    return next();
  } else {
    return res.redirect(`/campaigns/${req.params.id}`);
  }
}

 module.exports = campBelongsToUser;
