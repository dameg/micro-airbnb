var Comment = require('../models/comment'),
    Place   = require('../models/place');

var middlewareObj = {};

middlewareObj.checkPlaceOwnership = function (req, res, next) {
  if(req.isAuthenticated()) {
    Place.findById(req.params.id, function (error, foundPlace) {
      if (error) {
        res.redirect('back');
      } else {
        if (foundPlace.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (error, foundComment) {
      if (error) {
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
         next();
        } else {
          res.redirect('back');
        }
      }
    });
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if(req.isAuthenticated()) {
      next();
  } else {
      req.flash('error', 'You need to sign in first!');
      res.redirect('/login');
  }
};

module.exports = middlewareObj;
