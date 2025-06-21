const passport = require("passport");

const autenticacionJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      //console.error('Error de autenticación:', err || info);
      return res
        .status(401)
        .json({ success: false, message: "No autorizado", error: err.message });
    }
    if (!user) {
      //console.error('Usuario no encontrado o token inválido:', info);
      return res.status(401).json({ success: false, message: "No autorizado" });
    }
    //console.log('Usuario autenticado:', user);
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = autenticacionJwt;

// const passport = require('passport');

// const autenticacionJwt = (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err || !user) {
//       return res.status(401).json({
//         success: false,
//         message: 'No autorizado',
//         error: err?.message || info?.message || 'Token inválido o expirado',
//       });
//     }

//     req.user = user;
//     next();
//   })(req, res, next);
// };

// module.exports = autenticacionJwt;
