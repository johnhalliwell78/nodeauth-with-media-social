var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function (passport) {
    // passport session setup

    //required for persistent login sessions
    // passport needs ability to serializa and unserialize users out of session

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // Local Signup
};