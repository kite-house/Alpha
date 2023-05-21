const mysql = require('mysql2')

module.exports = mysql.createConnection({ 
    host: 'localhost',
    user: 'root',
    database: 'KITE-BOT',
    password: '',
})

module.exports.help = {
    name : "db",
    descrtiption: 'Подключение к базе данных!'
}