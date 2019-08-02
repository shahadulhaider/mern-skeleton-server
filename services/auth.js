const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');

const User = require('../models/user.model');
const config = require('../config/config');

passport.use(
  new LocalStrategy(
    { usernameField: 'email', },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false);
        }
        const match = await user.authenticateUser(password);
        if (!match) {
          return done(null, false);
        }

        return done(null, user);
      } catch (e) {
        return done(e, false);
      }
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload._id);
        if (!user) {
          return done(null, false, { message: 'No user' });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

const authLocal = passport.authenticate('local', { session: false });
const authJWT = passport.authenticate('jwt', { session: false });

module.exports = {
  authLocal,
  authJWT
};
