const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('./key');
const User = require('../modelo/user_model'); // Modelo para buscar usuarios

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = keys.JWT_SECRET;

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        //console.log('Payload recibido:', jwt_payload); // Log del payload
        try {
            // Buscar al usuario en la base de datos usando id_usuario
            const user = await User.findByUsername({ id_usuario: jwt_payload.id_usuario });
            if (user) {
                //console.log('Usuario encontrado:', user);
                return done(null, user); // Pasar el usuario encontrado
            } else {
                //console.log('Usuario no encontrado en la base de datos');
                return done(null, false);
            }
        } catch (error) {
            //console.error('Error en la estrategia JWT:', error);
            return done(error, false);
        }
    }));
};