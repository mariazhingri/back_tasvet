const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('./key');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = keys.JWT_SECRET;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        if (jwt_payload.user) {
            return done(null, jwt_payload);
        } else {
            return done(null, false);
        }
    }));
};
