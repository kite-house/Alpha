const mysql = require('mysql2')
require('dotenv').config()

module.exports = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    database: process.env.db_database,
    password: process.env.db_password
})

// ====================== HELP ==============================

module.exports.help = {
    name : "db",
    descrtiption: 'Подключение к базе данных!'
}