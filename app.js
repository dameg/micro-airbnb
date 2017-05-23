var express        = require('express'),
    app            = express(),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    flash          = require('connect-flash'),
    Comment        = require('./models/comment'),
    Place          = require('./models/place'),
    User           = require('./models/user');

//  ______            _
//  | ___ \          | |
//  | |_/ /___  _   _| |_ ___  ___
//  |    // _ \| | | | __/ _ \/ __|
//  | |\ \ (_) | |_| | ||  __/\__ \
//  \_| \_\___/ \__,_|\__\___||___/

var indexRoutes = require('./routes/index'),
    placeRoutes = require('./routes/places'),
    commentRoutes = require('./routes/comments');

//   _____              __ _
//  /  __ \            / _(_)
//  | /  \/ ___  _ __ | |_ _  __ _
//  | |    / _ \| '_ \|  _| |/ _` |
//  | \__/\ (_) | | | | | | | (_| |
//   \____/\___/|_| |_|_| |_|\__, |
//                            __/ |
//                           |___/

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(express.static(__dirname + '/public'));
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://testuser:qwerty@ds127531.mlab.com:27531/micro-airbnb');

// ______                              _     _____              __ _
// | ___ \                            | |   /  __ \            / _(_)
// | |_/ /_ _ ___ ___ _ __   ___  _ __| |_  | /  \/ ___  _ __ | |_ _  __ _
// |  __/ _` / __/ __| '_ \ / _ \| '__| __| | |    / _ \| '_ \|  _| |/ _` |
// | | | (_| \__ \__ \ |_) | (_) | |  | |_  | \__/\ (_) | | | | | | | (_| |
// \_|  \__,_|___/___/ .__/ \___/|_|   \__|  \____/\___/|_| |_|_| |_|\__, |
//                   | |                                              __/ |
//                   |_|                                             |___/

app.use(require('express-session')({
    secret: 'salt my password',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  _                     _
// | |                   | |
// | |     ___   ___ __ _| |
// | |    / _ \ / __/ _` | |
// | |___| (_) | (_| (_| | |
// \_____/\___/ \___\__,_|_|

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errorAlert = req.flash('error');
    res.locals.successAlert = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/places', placeRoutes);
app.use('/places/:id/comments', commentRoutes);

//   _____
//  /  ___|
//  \ `--.  ___ _ ____   _____ _ __
//   `--. \/ _ \ '__\ \ / / _ \ '__|
//  /\__/ /  __/ |   \ V /  __/ |
//  \____/ \___|_|    \_/ \___|_|

app.listen(process.env.PORT, process.env.IP, function () {
    console.log('Server started on localhost:3000');
});
