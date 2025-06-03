const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',  
  user: 'root',       
  password: '',       
  database: 'tasvet_operativo' 
});

// db.connect(err => {
//   if (err) {
  
//     return;
//   }
// });

module.exports = db;
