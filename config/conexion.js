const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tasvet_operativo'
});

// const db = mysql.createPool({
//   host: "localhost",
//   user: "lenn",
//   password: "batman",
//   database: "tasvet_operativo",
// });

// db.connect(err => {
//   if (err) {

//     return;
//   }
// });

module.exports = db;
