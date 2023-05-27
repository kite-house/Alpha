require('dotenv').config()
const Discord = require('discord.js')
const { EmbedBuilder } = require("@discordjs/builders");
const config = require('./config.json')
const talkedRecently = new Set();
const db = require('./module/db')
const check_permision = require('./module/check_permision')
const error_handling = require('./module/error_handling')
const end_reg_event = require('./module/end_reg_event')
const check_parti_event = require('./module/check_parti_event')
const { DisTube } = require('distube')

const client = new Discord.Client({
    intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildPresences,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
    ]
})

client.DisTube = new DisTube(client, {
    leaveOnStop: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
})

require('./module/loader')(client)

// ================= Main Code ===================================

client.on('ready', () => {
    client.commands.get('database_update')(client, interaction = 'System', db, config, check_permision)
    console.log('SYSTEM-INFO: DATABASE-MIGRATIONS | STATUS: ACCEPT!')
    client.user.setPresence({
        activities: [{ name: `за тобой`, type: Discord.ActivityType.Watching }],
        status: 'dnd',
      });
    console.log("SYSTEM-INFO: START | STATUS: ACCEPT!")
})

/// =========== Commands ===============

client.on('interactionCreate', interaction => {
    if(!interaction.isCommand()) return;
    if (talkedRecently.has(interaction.user.id)) {
        return error_handling(client, interaction, 'CustomError [Interaction]: Too frequent use')
    } else {
        talkedRecently.add(interaction.user.id);
        setTimeout(() => {
        talkedRecently.delete(interaction.user.id);
        }, 5000);
    }

    if (interaction.commandName === 'ping'){
        client.commands.get('ping')(client, interaction)
    }

    if (interaction.commandName === 'clear'){
        const value = interaction.options.getInteger('value');
        client.commands.get('clear')(client, interaction, value, check_permision)
    }

    if (interaction.commandName === 'database_update'){
        client.commands.get('database_update')(client, interaction, db, config, check_permision)
    }

    if (interaction.commandName === 'kick'){
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        client.commands.get('kick')(client, interaction, user, reason, check_permision, error_handling)
    }

    if (interaction.commandName === 'ban'){
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        client.commands.get('ban')(client, interaction, user, reason, check_permision, error_handling)
    }

    if (interaction.commandName === 'unban'){
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        client.commands.get('unban')(client, interaction, user, reason, check_permision, error_handling)
    }

    if (interaction.commandName === 'mute'){
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        const time = interaction.options.getInteger('time')
        client.commands.get('mute')(client, interaction, user, reason, time, check_permision, error_handling)
    }

    if (interaction.commandName === 'unmute'){
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        client.commands.get('unmute')(client, interaction, user, reason, check_permision, error_handling)
    }

    if (interaction.commandName === 'play'){
        const names = interaction.options.getString('names')
        return error_handling(client, interaction, 'CustomError [System]: Disabled function')
        client.commands.get('play')(client, interaction, names, config, error_handling)
    }

    if (interaction.commandName === 'stop'){
        return error_handling(client, interaction, 'CustomError [System]: Disabled function')
        client.commands.get('stop')(client, interaction, config, error_handling)
    }

    if (interaction.commandName === 'resume'){
        return error_handling(client, interaction, 'CustomError [System]: Disabled function')
        client.commands.get('resume')(client, interaction, config, error_handling)
    }

    if (interaction.commandName === 'pause'){
        return error_handling(client, interaction, 'CustomError [System]: Disabled function')
        client.commands.get('pause')(client, interaction, config, error_handling)
    }

    if (interaction.commandName === 'skip'){
        return error_handling(client, interaction, 'CustomError [System]: Disabled function')
        client.commands.get('skip')(client, interaction, config, error_handling)
    }

    if (interaction.commandName === 'queue'){
        return error_handling(client, interaction, 'CustomError [System]: Disabled function')
        client.commands.get('queue')(client, interaction, config, error_handling)
    }

    if (interaction.commandName == 'back'){
        return error_handling(client, interaction, 'CustomError [System]: Disabled function')
        client.commands.get('back')(client, interaction, config, error_handling)
    }

    if (interaction.commandName == 'all'){
        const roles = interaction.options.getRole("roles") 
        const text = interaction.options.getString("text")
        client.commands.get('all')(client, interaction, roles, text, check_permision, error_handling)
    }

    if (interaction.commandName == 'event'){
        const name = interaction.options.getString("name")
        const time = interaction.options.getString('time')
        const limited = interaction.options.getInteger("limited")
        const date = interaction.options.getString('date')
        const text = interaction.options.getString('text')
        client.commands.get('event')(client, interaction, name, time, limited, date, text, check_permision, db, config, error_handling)
    }

    if (interaction.commandName == 'info'){
        client.commands.get('info')(client, interaction, config)
    }

    if (interaction.commandName == 'send_update'){
        const version = interaction.options.getString('version')
        const text = interaction.options.getString('text')
        client.commands.get('send_update')(client, interaction, version, text, config, check_permision)
    }
})

client.on('interactionCreate', interaction => {
    if(!interaction.isButton()) return;
    if (talkedRecently.has(interaction.user.id)) {
        return error_handling(client, interaction, 'CustomError [Interaction]: Too frequent use')
    } else {
        talkedRecently.add(interaction.user.id);
        setTimeout(() => {
        talkedRecently.delete(interaction.user.id);
        }, 1000);
    }

    if (interaction.customId == `read_message`){
        client.buttons.get('read_message')(client, interaction, config, error_handling)
    } 

    if (interaction.customId == 'go_event'){
        client.buttons.get('go_event')(client, interaction, db, config, error_handling)
    }

    if (interaction.customId == 'leave_event'){
        client.buttons.get('leave_event')(client, interaction, db, config, error_handling)
    }

    if (interaction.customId == 'queue_event'){
        client.buttons.get('queue_event')(client, interaction, db, config, error_handling)
    }
})


/// =========== Communication ==========


client.on('messageCreate', message => { 
    if(message.author.bot) return;
    if(message.content.split(' ')[0] != '<@1111011163384336435>') return;
    message.content = message.content.replace('<@1111011163384336435>', '').trim()
    message.content = message.content.replace('?', '')
    message.content = message.content.replace('!', '')
    message.content = message.content.replace('.', '')
    message.content = message.content.toLowerCase()
    if (message.content == 'info'){
        message.reply('q')
    }
})


/// =========== Manage Users ===========

client.on('guildMemberUpdate', (oldMember,newMember) => {
    client.events.get('guildMemberUpdate')(client,oldMember, newMember, db, config)
    client.channels.cache.get(config.members).setName(`Members: ${client.guilds.cache.get(newMember.guild.id).memberCount}`)
})

client.on('guildMemberAdd', newUser => {
    client.events.get('guildMemberAdd')(client, newUser, db, config)
    client.channels.cache.get(config.members).setName(`Members: ${client.guilds.cache.get(newUser.guild.id).memberCount}`)
})

client.on('guildMemberRemove', oldUser => {
    client.events.get('guildMemberRemove')(client,oldUser, db, config)
    client.channels.cache.get(config.members).setName(`Members: ${client.guilds.cache.get(oldUser.guild.id).memberCount}`)
})


/// =========== Manage Server ===========

client.on('channelCreate', newChannel => {
    client.events.get('channelCreate')(client, newChannel, config)
})

client.on('channelDelete', oldChannel => {
    client.events.get("channelDelete")(client, oldChannel, config)
})

client.on('channelUpdate', upChannel => {
    if (upChannel.id == config.members) return 
    client.events.get("channelUpdate")(client, upChannel, config)
})

client.on('roleCreate', newRole => {
    client.events.get("roleCreate")(client, newRole, config)
})

client.on('roleDelete', oldRole => {
    client.events.get('roleDelete')(client, oldRole, config)
})

client.on('roleUpdate', upRole => {
    client.events.get("roleUpdate")(client, upRole, config)
})


var cron = require('node-cron');

task = cron.schedule('* * * * *', () => {
    datetime = new Date().toLocaleString('ru-RU', {timeZone: 'Europe/Moscow'})
    check_parti_event(client, datetime, db, config)
    end_reg_event(client, datetime, db, config)
  });

/// ============================== AUTHORIZATION =====================================

task.start()
client.login(process.env.SECRET_TOKEN_DISCORD)