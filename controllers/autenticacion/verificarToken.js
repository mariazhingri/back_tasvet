const passport = require('passport');

const autenticacionJwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: 'No autorizado' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = autenticacionJwt;