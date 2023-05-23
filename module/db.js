const mysql = require('mysql2')

module.exports = mysql.createConnection({ 
    host: 'db4free.net',
    user: 'admin_bot',
    database: 'morphy_bot',
    password: 'PMzBg4Snz3!3hF2'
})



/* {
    host: '',
    user: 'admin_bot',
    database: 'morphy_bot',
    password: 'PMzBg4Snz3!3hF2',
} */

// ====================== HELP ==============================

module.exports.help = {
    name : "db",
    descrtiption: 'Подключение к базе данных!'
}