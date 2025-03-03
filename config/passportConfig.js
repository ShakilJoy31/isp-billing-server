const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "477527863633-ajlkaloluipk0khau0b8911vppafab97.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: `${process.env.API}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

module.exports = passportConfig = passport;
