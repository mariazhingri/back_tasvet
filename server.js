const express = require("express");
const cors = require("cors");
const passport = require('passport');
const auth_outes = require("./routes/authRoutes");
const mascotas = require("./routes/mascotaRoutes");
const app = express();
const port = 5000; 

app.use(cors());
app.use(passport.initialize());
require('./config/passport')(passport);

app.use(express.json());

auth_outes(app);
mascotas(app);

// Iniciar el servidor
app.listen(port, () => {
 
});
