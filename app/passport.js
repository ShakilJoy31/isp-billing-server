const app = require("express").Router();
const session = require("express-session");
const passport = require("passport");
const User = require("../models/User");
const { roles } = require("../config/roles");
const { create_refresh_token } = require("../config/jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(
  session({
    secret: "sagar",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: `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`,
      callbackURL: `${process.env.API}/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      // Use the profile information to authenticate the user
      // ...
      cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async function (req, res) {
    const data = req?.user?._json;

    const exist = await User.findOne({ where: { email: data?.email } });

    if (exist) {
      const refresh_token = create_refresh_token({
        id: exist.id,
        role: exist?.role,
      });

      exist.refresh_token = refresh_token;
      await exist.save();

      res.cookie("jwt", refresh_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 90,
      });

      res.redirect("/");
    } else {
      const user = await User.create({
        ...data,
        role: roles.user,
      });

      const refresh_token = create_refresh_token({
        id: user.id,
        role: user?.role,
      });

      user.refresh_token = refresh_token;
      await user.save();

      res.cookie("jwt", refresh_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 90,
      });

      res.redirect("/");
    }
  }
);

module.exports = app;
