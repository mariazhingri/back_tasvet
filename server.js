const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const passport = require('passport');

const auth_outes = require("./routes/authRoutes");
const mascotas = require("./routes/mascotaRoutes");
const clientes = require("./routes/clienteRoutes");
const servicios = require("./routes/servicioRoutes");
const citas = require('./routes/citaRoutes')
const historialClinicoRoutes = require('./routes/historialClinicoRoutes');


const app = express();
const port = 5000;

// Middleware 
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Configurar passport
require('./config/passport')(passport);

// Rutas
clientes(app);
auth_outes(app);
mascotas(app);
servicios(app);
citas(app);
historialClinicoRoutes(app);


// Agregar logging para debugging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  console.log('📨 Body:', req.body);
  console.log('🍪 Cookies:', req.cookies);
  next();
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

//
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require('cookie-parser');
// const passport = require('passport');
// const auth_routes = require("./routes/authRoutes");
// const mascotas = require("./routes/mascotaRoutes");
// const clientes = require("./routes/clienteRoutes");
// const servicios = require("./routes/servicioRoutes");

// const app = express();
// const port = 5000;

// // 1. CORS 
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// // 2. Parsers
// app.use(express.json());
// app.use(cookieParser());

// // 3. Logging para debugging 
// app.use((req, res, next) => {
//   console.log(`📡 ${req.method} ${req.path}`);
//   console.log('📨 Body:', req.body);
//   console.log('🍪 Cookies:', req.cookies);
//   console.log('📋 Headers:', req.headers);
//   next();
// });

// // 4. Passport
// app.use(passport.initialize());

// // 5. Configurar passport
// require('./config/passport')(passport);

// // 6. RUTAS AL FINAL
// auth_routes(app);
// clientes(app);
// mascotas(app);
// servicios(app);

// // Iniciar el servidor
// app.listen(port, () => {
//   console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
// });
//
//


