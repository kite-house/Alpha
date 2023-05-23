require('dotenv').config()
const Discord = require('discord.js')
const { EmbedBuilder } = require("@discordjs/builders");
const config = require('./config.json')
const talkedRecently = new Set();
const db = require('./module/db')
const check_permision = require('./module/check_permision')
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

require('./module/loader')(client, process.env.SECRET_TOKEN_DISCORD, config)

// ================= Main Code ===================================

client.on('ready', () => {
    client.commands.get('database_update')(client, interaction = 'System', db, config)
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
        return interaction.reply(
            {embeds : [new EmbedBuilder()
                .setTitle(`Возникла ошибка!`)
                .setColor(Discord.Colors.Red)
                .setDescription(`Не спешите!`)
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username
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
        client.commands.get('database_update')(client, interaction, db, config)
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
        client.commands.get('play')(client, interaction, names, config)
    }

    if (interaction.commandName === 'stop'){
        client.commands.get('stop')(client, interaction, config)
    }

    if (interaction.commandName === 'resume'){
        client.commands.get('resume')(client, interaction, config)
    }

    if (interaction.commandName === 'pause'){
        client.commands.get('pause')(client, interaction, config)
    }

    if (interaction.commandName === 'skip'){
        client.commands.get('skip')(client, interaction, config)
    }

    if (interaction.commandName === 'queue'){
        client.commands.get('queue')(client, interaction, config)
    }

    if (interaction.commandName == 'back'){
        client.commands.get('back')(client, interaction, config)
    }

    if (interaction.commandName == 'all'){
        const roles = interaction.options.getRole("roles") 
        const text = interaction.options.getString("text")
        client.commands.get('all')(client, interaction, roles, text, check_permision)
    }

    if (interaction.commandName == 'event'){
        const name = interaction.options.getString("name")
        const time = interaction.options.getString('time')
        const limited = interaction.options.getInteger("limited")
        const date = interaction.options.getString('date')
        const text = interaction.options.getString('text')
        client.commands.get('event')(client, interaction, name, time, limited, date, text, check_permision, db, config)
    }
})

client.on('interactionCreate', interaction => {
    if(!interaction.isButton()) return;
    if (talkedRecently.has(interaction.user.id)) {
        return interaction.reply(
            {embeds : [new EmbedBuilder()
                .setTitle(`Возникла ошибка!`)
                .setColor(Discord.Colors.Red)
                .setDescription(`Не спешите!`)
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username
                })
                .setTimestamp()
            ],ephemeral: true    
        })
    } else {
        talkedRecently.add(interaction.user.id);
        setTimeout(() => {
        talkedRecently.delete(interaction.user.id);
        }, 1000);
    }

    console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.customId}`)

    if (interaction.customId == `read_message`){
        client.channels.cache.get(config.log_read_all).send(`<@${interaction.user.id}> нажал кнопку прочитать!`)
        interaction.message.delete().catch(error => {error})
    } 

    if (interaction.customId == 'go_event'){
        client.buttons.get('go_event')(client, interaction, db, config)
    }

    if (interaction.customId == 'leave_event'){
        client.buttons.get('leave_event')(client, interaction, db, config)
    }

    if (interaction.customId == 'queue_event'){
        client.buttons.get('queue_event')(client, interaction, db, config)
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
    // Пока не рабочий код
})


/// =========== Manage Users ===========

client.on('guildMemberUpdate', (oldMember,newMember) => {
    console.log(`MEMBER-INFO: USER: ${newMember.user.id} UPDATED`)
    client.events.get('guildMemberUpdate')(client,oldMember, newMember, db, config)
    client.channels.cache.get(config.members).setName(`Members: ${client.guilds.cache.get(newMember.guild.id).memberCount}`)
})

client.on('guildMemberAdd', newUser => {
    console.log(`MEMBER-INFO: USER: ${newUser.user.id} UPDATED`)
    client.events.get('guildMemberAdd')(client, newUser, db, config)
    client.channels.cache.get(config.members).setName(`Members: ${client.guilds.cache.get(newUser.guild.id).memberCount}`)
})

client.on('guildMemberRemove', oldUser => {
    console.log(`MEMBER-INFO: USER: ${oldUser.user.id} UPDATED`)
    client.events.get('guildMemberRemove')(client,oldUser, db, config)
    client.channels.cache.get(config.members).setName(`Members: ${client.guilds.cache.get(oldUser.guild.id).memberCount}`)
})


/// =========== Manage Server ===========

client.on('channelCreate', newChannel => {
    console.log(`SERVER-INFO: CREATE NEW CHANNEL`)
    client.events.get('channelCreate')(client, newChannel, config)
})

client.on('channelDelete', oldChannel => {
    console.log(`SERVER-INFO: DELETE CHANNEL`)
    client.events.get("channelDelete")(client, oldChannel, config)
})

client.on('channelUpdate', upChannel => {
    if (upChannel.id == config.members) return 
    console.log(`SERVER-INFO: UPDATE CHANNEL`)
    client.events.get("channelUpdate")(client, upChannel, config)
})

client.on('roleCreate', newRole => {
    console.log(`SERVER-INFO: CREATE NEW ROLE`)
    client.events.get("roleCreate")(client, newRole, config)
})

client.on('roleDelete', oldRole => {
    console.log(`SERVER-INFO: DELETE ROLE`)
    client.events.get('roleDelete')(client, oldRole, config)
})

client.on('roleUpdate', upRole => {
    console.log(`SERVER-INFO: UPDATE ROLE`)
    client.events.get("roleUpdate")(client, upRole, config)
})



/// ============================== AUTHORIZATION =====================================


client.login(process.env.SECRET_TOKEN_DISCORD)