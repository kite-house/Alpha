const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')

module.exports = async(client, oldMember, newMember, db, config) => {
    const AuditLogFetch = await newMember.guild.fetchAuditLogs({limit: 1})
    const Entry = AuditLogFetch.entries.first()

/// ============================== Изменение NICKNAME =========================================

    if (oldMember.nickname === null){
        oldMember.nickname = oldMember.user.username
    }

    if (newMember.nickname === null){
        newMember.nickname = newMember.user.username
    }

    if (oldMember.nickname != newMember.nickname){
        console.log(`MEMBER-INFO: USER: ${newMember.user.id} UPDATED | INFO: UPDATE_NICKNAME | STATUS: ACCEPT!`)
        client.channels.cache.get(config.ds_member).send(
            {embeds : [new EmbedBuilder()
                .setAuthor({iconURL: newMember.user.avatarURL(newMember.user.avatar) , name: `${newMember.user.username}#${newMember.user.discriminator}`})
                .setThumbnail(newMember.user.avatarURL(newMember.user.avatar))
                .setTitle(`Пользователь обновил свой профиль!`)
                .setDescription(`Участник <@${oldMember.user.id}> изменил никнейм`)
                .setColor(Discord.Colors.DarkBlue)
                .setFields([
                    {
                    name: 'Было:', 
                    value : `${oldMember.nickname}`,
                    inline : true
                    },
                    {
                    name: 'Стало:',
                    value : `${newMember.nickname}`,
                    inline: true
                    },
                    {
                        name : "Информация: ",
                        value : `Изменил: <@${Entry.executor.id}>`
                    }
                ])
                .setFooter({
                    text : `ID User: ${oldMember.user.id}`
                })
                .setTimestamp()
            ]})
        db.query(`UPDATE users SET nickname = '${newMember.nickname}' WHERE discord_id = '${oldMember.user.id}'`, function(error, results) {
            if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ${error}`);
            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ACCEPT!`)
        })
    }  

/// ============================== Изменение USERNAME#TAG ======================================

    if (oldMember.user.username + '#' + oldMember.user.desriminator != newMember.user.username + "#" + newMember.user.desriminator){
        console.log(`MEMBER-INFO: USER: ${newMember.user.id} UPDATED | INFO: UPDATE_USERNAME | STATUS: ACCEPT!`)
        client.channels.cache.get(config.ds_member).send(
            {embeds : [new EmbedBuilder()
                .setAuthor({iconURL: newMember.user.avatarURL(newMember.user.avatar) , name: `${newMember.user.username}#${newMember.user.discriminator}`})
                .setThumbnail(newMember.user.avatarURL(newMember.user.avatar))
                .setTitle(`Пользователь обновил свой профиль!`)
                .setDescription(`Участник <@${oldMember.user.id}> изменил юзернейм`)
                .setColor(Discord.Colors.DarkBlue)
                .setFields([
                    {
                    name: 'Было:', 
                    value : `${oldMember.user.username}#${oldMember.user.desriminator}`,
                    inline : true
                    },
                    {
                    name: 'Стало:',
                    value : `${newMember.user.username}#${newMember.user.desriminator}`,
                    inline: true
                    }
                ])
                .setFooter({
                    text : `ID User: ${oldMember.user.id}`
                })
                .setTimestamp()
            ]})

        db.query(`UPDATE users SET system_username = '${newMember.user.username + '#' + newMember.user.desriminator}' WHERE discord_id = '${oldMember.user.id}'`, function(error, results) {
            if(error) client.channels.cache.get(config_database).send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ${error}`);
            client.channels.cache.get(config_database).send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ACCEPT!`)

        })
    }

/// ============================== Изменение AVATAR ===========================================

    if (oldMember.user.avatar != newMember.user.avatar){
        db.query(`UPDATE users SET avatar = '${newMember.user.avatar}' WHERE discord_id = '${oldMember.user.id}'`, function(error, results) {
            if(error) client.channels.cache.get(config_database).send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ${error}`);
            client.channels.cache.get(config_database).send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ACCEPT!`)
        })
        console.log(`MEMBER-INFO: USER: ${newMember.user.id} UPDATED | INFO: UPDATE_AVATAR | STATUS: ACCEPT!`)
    }

/// ============================== Изменение ROLES ============================================

    let oldMember_roles = oldMember.roles.cache.map(r => r).join(', ').replace(", @everyone", '').split(', ')
    let newMember_roles = newMember.roles.cache.map(r => r).join(', ').replace(", @everyone", '').split(', ')
    
    if (oldMember_roles.toString() != newMember_roles.toString()){

        text = (':heavy_plus_sign: ' + newMember_roles.filter(e => !new Set(oldMember_roles).has(e)));

        if (oldMember_roles.length > newMember_roles.length){
            text = (':heavy_minus_sign: ' + oldMember_roles.filter(e => !new Set(newMember_roles).has(e)));
        } 
        
        if (newMember_roles.length > oldMember_roles.length){
            text = (':heavy_plus_sign: ' + newMember_roles.filter(e => !new Set(oldMember_roles).has(e)));
        }
        
        console.log(`MEMBER-INFO: USER: ${newMember.user.id} UPDATED | INFO: UPDATE_ROLES | STATUS: ACCEPT!`)

        client.channels.cache.get(config.ds_member).send(
            {embeds : [new EmbedBuilder()
                .setAuthor({iconURL: newMember.user.avatarURL(newMember.user.avatar) , name: `${newMember.user.username}#${newMember.user.discriminator}`})
                .setThumbnail(newMember.user.avatarURL(newMember.user.avatar))
                .setTitle(`Обновление ролей участника!`)
                .setDescription(`Участнику <@${oldMember.user.id}> изменили роли`)
                .setDescription(text)
                .setColor(Discord.Colors.DarkBlue)
                .setFields([
                    {
                        name : "Информация: ",
                        value : `Изменил: <@${Entry.executor.id}>`
                    }
                ])
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text : `ID User: ${oldMember.user.id}`
                })
                .setTimestamp()
            ]})

        db.query(`UPDATE users SET roles = '${newMember_roles}' WHERE discord_id = '${oldMember.user.id}'`, function(error, results) {
            if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ${error}`);
            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ACCEPT!`)
        })
    }
}

// ================== HELP ============================

module.exports.help = {
    name: 'guildMemberUpdate',
    description: 'Обновление пользователя'
}
