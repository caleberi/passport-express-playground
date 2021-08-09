const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "name",
      passwordField: "password",
    },
    function (username, password, done) {
      User.findOne({ name: username }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          User.create({
            name: username,
            password: password,
          })
            .then((user) => {
              return done(null, user);
            })
            .catch((err) => {
              return done(err);
            });
          return;
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      signInUser(
        {
          Strategy: "google",
          profile: processProfile(profile),
        },
        done
      );
    }
  )
);

function processProfile(profile) {
  return {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    picture: profile.photos[0].value,
  };
}

function signInUser(userProfile, done) {
  console.log("signInUser", userProfile);
  User.findOne({ name: userProfile.profile.name }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      User.create(userProfile.profile)
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
      return;
    }
    return done(null, user);
  });
}

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

module.exports = passport;
