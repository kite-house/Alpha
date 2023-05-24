const mysql = require('mysql2')
require('dotenv').config()

module.exports = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQLDATABASE,
    password: process.env.MYSQLPASSWORD
})




// ====================== HELP ==============================

module.exports.help = {
    name : "db",
    descrtiption: 'Подключение к базе данных!'
}