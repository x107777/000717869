//imports
const JwTStrategy = require('passport-jwt').Strategy;
const ExtractJwT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

//created the payload
module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwT.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = config.secret;
    passport.use(new JwTStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);          
        User.getUserById(jwt_payload.data._id, (err, user) => { //trying to find user with payload -> id
            if(err) {
                return done(err, false);
            }
            if(user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
}