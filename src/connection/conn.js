const mysql = require("mysql");

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:process.env.MYSQLPASSWORD,
    database:"airport_management_system"
})

module.exports = conn;