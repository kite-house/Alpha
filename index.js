const fs = require('fs')
require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
    ]
})
const { EmbedBuilder } = require("@discordjs/builders");
const {ds_member, ds_server, new_members, members} = require('./config.json')
const talkedRecently = new Set();
const db = require('./db')
console.log('SYSTEM-INFO: DATABASE | STATUS: ACCEPT!')

check_permision = require('./check_permision')

const loader = require('./loader')
loader(client, process.env.SECRET_TOKEN_DISCORD)

const { DisTube } = require('distube')

client.DisTube = new DisTube(client, {
    leaveOnStop: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
})

// ================= Main Code ===================================

client.on('ready', () => {
    client.commands.get('database_update')(client, interaction = 'System', db)
    console.log('SYSTEM-INFO: DATABASE-MIGRATIONS | STATUS: ACCEPT!')
    console.log("SYSTEM-INFO: START | STATUS: ACCEPT!")
    client.user.setPresence({
        activities: [{ name: `за тобой`, type: Discord.ActivityType.Watching }],
        status: 'dnd',
      });
})

/// =========== Commands ===============

client.on('interactionCreate', interaction => {
    if (talkedRecently.has(interaction.user.id)) {
        return interaction.reply(
            {embeds : [new EmbedBuilder()
                .setTitle(`Возникла ошибка!`)
                .setColor(Discord.Colors.Red)
                .setDescription(`Не спешите!`)
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username + " • " + interaction.member.voice.channel.name
                })
                .setTimestamp()
            ],ephemeral: true    
        })
    } else {
        talkedRecently.add(interaction.user.id);
        setTimeout(() => {
        talkedRecently.delete(interaction.user.id);
        }, 5000);
    }
    console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.commandName}`)
    if (interaction.commandName === 'ping'){
        client.commands.get('ping')(client, interaction)
    }

    if (interaction.commandName === 'clear'){
        const value = interaction.options.getInteger('value');
        client.commands.get('clear')(client, interaction, value, check_permision)
    }

    if (interaction.commandName === 'database_update'){
        client.commands.get('database_update')(client, interaction, db)
    }

    if (interaction.commandName === 'kick'){
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        client.commands.get('kick')(client, interaction, user, reason, check_permision)
    }

    if (interaction.commandName === 'ban'){
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        client.commands.get('ban')(client, interaction, user, reason, check_permision)
    }

    if (interaction.commandName === 'unban'){
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        client.commands.get('unban')(client, interaction, user, reason, check_permision)
    }

    if (interaction.commandName === 'mute'){
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        const time = interaction.options.getInteger('time')
        client.commands.get('mute')(client, interaction, user, reason, time, check_permision)
    }

    if (interaction.commandName === 'unmute'){
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        client.commands.get('unmute')(client, interaction, user, reason, check_permision)
    }

    if (interaction.commandName === 'play'){
        const names = interaction.options.getString('names')
        client.commands.get('play')(client, interaction, names, interaction.channel.id)
    }

    if (interaction.commandName === 'stop'){
        client.commands.get('stop')(client, interaction, interaction.channel.id)
    }

    if (interaction.commandName === 'resume'){
        client.commands.get('resume')(client, interaction, interaction.channel.id)
    }

    if (interaction.commandName === 'pause'){
        client.commands.get('pause')(client, interaction, interaction.channel.id)
    }
})


/// =========== Communication ==========


client.on('messageCreate', message => { 
    if(message.author.bot) return;
    if(message.content.split(' ')[0] != '<@960267917088411679>') return;
    message.content = message.content.replace('<@960267917088411679>', '').trim()
    message.content = message.content.replace('?', '')
    message.content = message.content.replace('!', '')
    message.content = message.content.replace('.', '')
    message.content = message.content.toLowerCase()
    if (message.content == 'привет'){
        message.reply('привет')
    }
})


/// =========== Manage Users ===========

client.on('guildMemberUpdate', (oldMember,newMember) => {
    console.log(`MEMBER-INFO: USER: ${newMember.user.id} UPDATED`)
    client.events.get('guildMemberUpdate')(client,oldMember, newMember,db, ds_member)
    client.channels.cache.get(members).setName(`Members: ${client.guilds.cache.get("1105726968260997120").memberCount}`)
})

client.on('guildMemberAdd', newUser => {
    console.log(`MEMBER-INFO: USER: ${newUser.user.id} UPDATED`)
    client.events.get('guildMemberAdd')(client,newUser,db, ds_member)
    client.channels.cache.get(members).setName(`Members: ${client.guilds.cache.get("1105726968260997120").memberCount}`)
})

client.on('guildMemberRemove', oldUser => {
    console.log(`MEMBER-INFO: USER: ${oldUser.user.id} UPDATED`)
    client.events.get('guildMemberRemove')(client,oldUser,db, ds_member)
    client.channels.cache.get(members).setName(`Members: ${client.guilds.cache.get("1105726968260997120").memberCount}`)
})


/// =========== Manage Server ===========

client.on('channelCreate', newChannel => {
    console.log(`SERVER-INFO: CREATE NEW CHANNEL`)
    client.events.get('channelCreate')(client, newChannel, ds_server)
})

client.on('channelDelete', oldChannel => {
    console.log(`SERVER-INFO: DELETE CHANNEL`)
    client.events.get("channelDelete")(client, oldChannel, ds_server)
})

client.on('channelUpdate', upChannel => {
    if (upChannel.id == '1105727699147833394') return 
    console.log(`SERVER-INFO: UPDATE CHANNEL`)
    client.events.get("channelUpdate")(client, upChannel, ds_server)
})

client.on('roleCreate', newRole => {
    console.log(`SERVER-INFO: CREATE NEW ROLE`)
    client.events.get("roleCreate")(client, newRole, ds_server)
})

client.on('roleDelete', oldRole => {
    console.log(`SERVER-INFO: DELETE ROLE`)
    client.events.get('roleDelete')(client, oldRole, ds_server)
})

client.on('roleUpdate', upRole => {
    console.log(`SERVER-INFO: UPDATE ROLE`)
    client.events.get("roleUpdate")(client, upRole, ds_server)
})



/// ============================== AUTHORIZATION =====================================


client.login(process.env.SECRET_TOKEN_DISCORD, (error) => {
    client.users.cache.get('343339732975091714').send(`ERROR LOG: ${error}`)
})