const mysql = require('mysql');

// Create a connection to the MariaDB/MySQL database
const db = mysql.createConnection({
  host: 'localhost',   // Hostname
  port: 3307,          // MariaDB/MySQL Port
  user: 'root', // MySQL User
  password: 'ASDfg!@#1234', // MySQL Password
  database: 'onlinepos',  // Database Name
});

// Connect to the MySQL/MariaDB database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the MariaDB/MySQL database');
});

// Export the db object for use in other files
module.exports = db;
