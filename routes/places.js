var express    = require('express'),
    router     = express.Router(),
    Place      = require('../models/place'),
    middleware = require('../middleware');

router.get('/', function (req, res) {
    Place.find({}, function(error, allPlaces) {
        if (error) {
            console.log(error);
        } else {
            res.render('places/index', {
                places: allPlaces
            });
        }
    });
});

router.post('/', function (req, res) {
    var name        = req.body.name,
        image       = req.body.image,
        location    = req.body.location,
        description = req.body.description,
        price       = req.body.price,
        author      = {
                        id: req.user._id,
                        username: req.user.username
                      };

    var newPlace = Place.create({
            name        : name,
            image       : image,
            location    : location,
            description : description,
            price       : price,
            author      : author
        },
        function(error, newPlace) {
            if (error) {
                console.log(error);
            } else {
                console.log(newPlace);
            }
        }
    );
    res.redirect('/places');
});

router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('places/new');
});

router.get('/:id', function(req, res) {
    Place.findById(req.params.id)
        .populate('comments')
        .exec(function(error, foundplace) {
            if (error) {
                res.render('/places');
            } else {
                res.render('places/show', {
                    place : foundplace
                });
            }
        });
});

router.get('/:id/edit', middleware.checkPlaceOwnership, function (req, res) {
  Place.findById(req.params.id, function (error, foundPlace) {
           res.render('places/edit', {place : foundPlace});
    });
});

router.put('/:id', middleware.checkPlaceOwnership, function (req, res) {
  Place.findByIdAndUpdate(req.params.id, req.body.place, function (error, foundPlace) {
    if (error) {
      res.redirect('/places');
    } else {
      res.redirect('/places/' + req.params.id);
    }
  });
});

router.delete('/:id', middleware.checkPlaceOwnership, function (req, res) {
  Place.findByIdAndRemove(req.params.id, function (error, foundPlace) {
    if (error) {
      res.redirect('/places/' + req.params.id);
    } else {
      res.redirect('/places');
    }
  });
});

module.exports = router;
