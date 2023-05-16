const Discord = require('discord.js')
const fs = require('fs')

module.exports = (client, token) => {
    client.commands = new Discord.Collection()
    client.events = new Discord.Collection()
    client.channel_structure = new Discord.Collection()
    client.communication = new Discord.Collection()
    const commands = [];


    fs.readdir('./commands', (err, files) => { // чтение файлов в папке commands
        if (err) console.log(err)
    
        let jsfile = files.filter(f => f.split('.').pop() === 'js') // файлы не имеющие расширение .js игнорируются
        if (jsfile.length <= 0) return console.log('ERROR-INFO: COMMANDS NOT FOUND!') // если нет ни одного файла с расширением .js
    
        jsfile.forEach((f, i) => { // добавляем каждый файл в коллекцию команд
            let props = require(`./commands/${f}`)
            client.commands.set(props.help.name, props)
            commands.push(props.help.data.toJSON());
        })
        const rest = new Discord.REST().setToken(token);
        
        const data = rest.put(
            Discord.Routes.applicationGuildCommands('960267917088411679', '1105726968260997120'),
            { body: commands },
        
        console.log(`SYSTEM-INFO: LOADING ${jsfile.length} COMMANDS | STATUS: ACCEPT!`)
        
        );
    })
    
    // ================= Загружаем Events ============================
    
    fs.readdir('./events', (err, files) => { // чтение файлов в папке commands
        if (err) console.log(err)
    
        let jsfile = files.filter(f => f.split('.').pop() === 'js') // файлы не имеющие расширение .js игнорируются
        if (jsfile.length <= 0) return console.log('ERROR-INFO: EVENTS NOT FOUND!') // если нет ни одного файла с расширением .js
    
        console.log(`SYSTEM-INFO: LOADING ${jsfile.length} EVENTS | STATUS: ACCEPT!`)
        jsfile.forEach((f, i) => { // добавляем каждый файл в коллекцию команд
            let props = require(`./events/${f}`)
            client.events.set(props.help.name, props)
        })
    })
    
}

module.exports.help = {
    name: 'loader',
    description: 'Загружает все команды/каналы/события'
}