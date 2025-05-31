const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',  
  user: 'lennuser',       
  password: 'batman',       
  database: 'tasvet' 
});

// db.connect(err => {
//   if (err) {
  
//     return;
//   }
// });

module.exports = db;
