const dotenv = require('dotenv');
dotenv.config();


const mysql = require('mysql2/promise');

const db = mysql.createPool({ 
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)

});

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'lenn',
//   password: 'batman',
//   database: 'tasvet_operativo',
// });

// db.connect(err => {
//   if (err) {
//     return;
//   }
// });

module.exports = db;
