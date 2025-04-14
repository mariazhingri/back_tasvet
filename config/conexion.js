const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',  
  user: 'root',       
  password: '',       
  database: 'tasvet_operativo' 
});

db.connect(err => {
  if (err) {
  
    return;
  }
});

module.exports = db;
