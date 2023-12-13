const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Isla1779',
    database: 'employeeTracker_db'
});
module.exports = db;