const Discord = require('discord.js')
const fs = require('fs')

module.exports = (client) => {
    client.commands = new Discord.Collection()
    client.events = new Discord.Collection()
    client.buttons = new Discord.Collection()

    // ================= Загружаем Commands ============================

    fs.readdir('./commands', (error, files) => {
        if (error) console.log(error)

        files_moderator = fs.readdirSync('./commands/moderator')
        files_music = fs.readdirSync('./commands/music')

        for (i in files_moderator){
            files_moderator[i] = 'moderator/' + files_moderator[i]
        }

        for (i in files_music){
            files_music[i] = 'music/' + files_music[i]
        }

        let jsfile = files.filter(f => f.split('.').pop() === 'js') + ','
        jsfile = jsfile + files_moderator.filter(f => f.split('.').pop() === 'js') + ','
        jsfile = jsfile + files_music.filter(f => f.split('.').pop() === 'js')
        jsfile = jsfile.split(',')

        if (jsfile.length <= 0) return console.error('ERROR-INFO: COMMANDS NOT FOUND!')

        jsfile.forEach((f, i) => {
            let props = require(`../commands/${f}`)
            client.commands.set(props.help.name, props)
        })

        console.log(`SYSTEM-INFO: LOADING ${jsfile.length} COMMANDS | STATUS:`, `ACCEPT!`.green)

    })
    
    // ================= Загружаем Events ============================
    
    fs.readdir('./events', (error, files) => {
        if (error) console.log(error)
    
        let jsfile = files.filter(f => f.split('.').pop() === 'js')
        if (jsfile.length <= 0) return console.error('ERROR-INFO: EVENTS NOT FOUND!')
    
        console.log(`SYSTEM-INFO: LOADING ${jsfile.length} EVENTS | STATUS:`, `ACCEPT!`.green)
        jsfile.forEach((f, i) => {
            let props = require(`../events/${f}`)
            client.events.set(props.help.name, props)
        })
    })

    // ================= Загружаем Buttons ============================

    fs.readdir('./buttons', (error, files) => {
        if (error) console.log(error)
    
        let jsfile = files.filter(f => f.split('.').pop() === 'js')
        if (jsfile.length <= 0) return console.error('ERROR-INFO: BUTTONS NOT FOUND!')
    
        jsfile.forEach((f, i) => { 
            let props = require(`../buttons/${f}`)
            client.buttons.set(props.help.name, props)
        })

        console.log(`SYSTEM-INFO: LOADING ${jsfile.length} BUTTONS | STATUS:`, `ACCEPT!`.green)
    })
    
}

// ====================== HELP ==============================

module.exports.help = {
    name: 'loader',
    description: 'Загружает все команды/каналы/события'
}