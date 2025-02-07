const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../routes/User');  // افترض أن لديك موديل المستخدم في قاعدة البيانات

module.exports = function(passport) {
    // إعداد passport لتخزين واسترجاع بيانات المستخدم
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // إعداد استراتيجية Google
    passport.use(new GoogleStrategy({
        clientID: 'YOUR_GOOGLE_CLIENT_ID',
        clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
        callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ googleId: profile.id }, (err, user) => {
            if (err) return done(err);
            if (!user) {
                const newUser = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                });
                newUser.save().then(user => done(null, user));
            } else {
                return done(null, user);
            }
        });
    }));

    // إعداد استراتيجية Facebook
    passport.use(new FacebookStrategy({
        clientID: 'YOUR_FACEBOOK_APP_ID',
        clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
        callbackURL: 'http://localhost:5000/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ facebookId: profile.id }, (err, user) => {
            if (err) return done(err);
            if (!user) {
                const newUser = new User({
                    facebookId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                });
                newUser.save().then(user => done(null, user));
            } else {
                return done(null, user);
            }
        });
    }));
};
