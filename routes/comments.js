var express    = require('express'),
    router     = express.Router({mergeParams : true}),
    Place      = require('../models/place'),
    Comment    = require('../models/comment'),
    middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, function (req, res) {
    console.log(req.params.id);
    Place.findById(req.params.id, function(error, foundPlace) {
       if(error) {
           console.log(error);
       } else {
           res.render('comments/new', {place : foundPlace});
       }
    });
});

router.post('/', middleware.isLoggedIn, function (req, res) {
   Place.findById(req.params.id, function (error, foundPlace) {
       if(error) {
           console.log(error);
           res.redirect('/places');
       } else {
           Comment.create(req.body.comment, function (error, comment) {
               if (error) {

               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   console.log(comment);
                   foundPlace.comments.push(comment);
                   foundPlace.save();
                   res.redirect('/places/' + foundPlace._id);
               }
           });
       }
   });
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (error, foundComment) {
    if (error) {
      res.redirect('back');
    } else {
          res.render('comments/edit', {comment : foundComment, placeId : req.params.id});
    }
  });
});

router.put('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (error, foundComment) {
    if(error) {
      res.redirect('back');
    } else {
      res.redirect('/places/' + req.params.id);
    }
  });
});

router.delete('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (error, foundComment) {
    if (error) {
       res.redirect('/places/' + req.params.id);
    } else {
       res.redirect('/places/' + req.params.id);
    }
  });
});

module.exports = router;
