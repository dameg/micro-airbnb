var express  = require('express'),
    router   = express.Router(),
    passport = require('passport'),
    User     = require('../models/user');

router.get('/', function (req, res) {
        res.redirect('/places');
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    var newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, function (error, user) {
       if (error) {
           res.render('/register');
       } else {
           passport.authenticate('local')(req, res, function () {
               res.redirect('/places');
           });
       }
    });
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect : '/places',
        failureRedirect : '/login'
}),function (req, res) {
});

router.get('/logout', function (req, res) {
        req.logout();
        req.flash('success', 'You have successfully logged out!');
        res.redirect('/places');
});

module.exports = router;
