var mongoose = require('mongoose');

var placeSchema = new mongoose.Schema( {
    name          : String,
    image         : String,
    location      : String,
    description   : String,
    price         : String,
    author        : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'User'
        },
        username : String
    },
    comments      : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ]
});

module.exports = mongoose.model('Place', placeSchema);
