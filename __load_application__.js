const Discord = require('discord.js')
const config = require('./config.json');
const fs = require('fs');
require('dotenv').config()
const commands = [];
const buttons = [];

// Place your client and guild ids here

fs.readdir('./commands', (err, files) => { // чтение файлов в папке commands
    if (err) console.log(err)

    files_moderator = fs.readdirSync('./commands/moderator')
    files_music = fs.readdirSync('./commands/music')

    for (i in files_moderator){
        files_moderator[i] = 'moderator/' + files_moderator[i]
    }

    for (i in files_music){
        files_music[i] = 'music/' + files_music[i]
    }

    let jsfile = files.filter(f => f.split('.').pop() === 'js') + ','// файлы не имеющие расширение .js игнорируются

    jsfile = jsfile + files_moderator.filter(f => f.split('.').pop() === 'js') + ','
    jsfile = jsfile + files_music.filter(f => f.split('.').pop() === 'js')
    jsfile = jsfile.split(',')

    if (jsfile.length <= 0) return console.log('ERROR-INFO: COMMANDS NOT FOUND!') // если нет ни одного файла с расширением .js

    jsfile.forEach((f, i) => { // добавляем каждый файл в коллекцию команд
        let props = require(`./commands/${f}`)
        commands.push(props.help.data.toJSON());
    })

    const rest = new Discord.REST().setToken(process.env.SECRET_TOKEN_DISCORD);

    rest.put(
        Discord.Routes.applicationGuildCommands('960267917088411679', config.id_server_main),
        { body: commands },
    
    );

    console.log(`SYSTEM-INFO: LOADING ${jsfile.length} COMMANDS | STATUS: ACCEPT!`)
})

fs.readdir('./buttons', (err, files) => { // чтение файлов в папке commands
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split('.').pop() === 'js') // файлы не имеющие расширение .js игнорируются
    if (jsfile.length <= 0) return console.log('ERROR-INFO: BUTTONS NOT FOUND!') // если нет ни одного файла с расширением .js

    jsfile.forEach((f, i) => { // добавляем каждый файл в коллекцию команд
        let props = require(`./buttons/${f}`)
        buttons.push(props.help.data.toJSON());
    })
    const rest = new Discord.REST().setToken(process.env.SECRET_TOKEN_DISCORD);

    rest.put(
        Discord.Routes.applicationGuildCommands('960267917088411679', config.id_server_main),
        { body: buttons },
    
    );

    console.log(`SYSTEM-INFO: LOADING ${jsfile.length} BUTTONS | STATUS: ACCEPT!`)
})