const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')

module.exports = async(client, oldMember, newMember, db, audit) => {
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
        client.channels.cache.get(audit).send(
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
        db.query(`UPDATE users SET nickname = '${newMember.nickname}' WHERE discord_id = '${oldMember.user.id}'`, function(err, results) {
            if(err) client.channels.cache.get('1105738078443798588').send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: FAIL!`);
            client.channels.cache.get('1105738078443798588').send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ACCEPT!`)
        })
    }  

/// ============================== Изменение USERNAME#TAG ======================================

    if (oldMember.user.username + '#' + oldMember.user.desriminator != newMember.user.username + "#" + newMember.user.desriminator){
        client.channels.cache.get(audit).send(
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

        db.query(`UPDATE users SET system_username = '${newMember.user.username + '#' + newMember.user.desriminator}' WHERE discord_id = '${oldMember.user.id}'`, function(err, results) {
            if(err) client.channels.cache.get('1097079544869027880').send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: FAIL!`);
            client.channels.cache.get('1097079544869027880').send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ACCEPT!`)

        })
    }

/// ============================== Изменение AVATAR ===========================================

    if (oldMember.user.avatar != newMember.user.avatar){
        db.query(`UPDATE users SET avatar = '${newMember.user.avatar}' WHERE discord_id = '${oldMember.user.id}'`, function(err, results) {
            if(err) client.channels.cache.get('1097079544869027880').send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: FAIL!`);
            client.channels.cache.get('1097079544869027880').send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ACCEPT!`)
        })
    }

/// ============================== Изменение ROLES ============================================

    let oldMember_role = oldMember.roles.cache.map(r => r).join(', ').replace(", @everyone", '').split(', ')
    let newMember_role = newMember.roles.cache.map(r => r).join(', ').replace(", @everyone", '').split(', ')
    
    if (oldMember_role.toString() != newMember_role.toString()){
        if (oldMember_role.length > newMember_role.length){
            text = (':heavy_minus_sign: ' + oldMember_role.filter(e => !new Set(newMember_role).has(e)));
        } 
        
        if (newMember_role.length > oldMember_role.length){
            text = (':heavy_plus_sign: ' + newMember_role.filter(e => !new Set(oldMember_role).has(e)));
        }
        
        client.channels.cache.get(audit).send(
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
                    text : `ID User: ${oldMember.user.id}`
                })
                .setTimestamp()
            ]})

        db.query(`UPDATE users SET role = '${newMember_role}' WHERE discord_id = '${oldMember.user.id}'`, function(err, results) {
            if(err) client.channels.cache.get('1105738078443798588').send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: FAIL!`);
            client.channels.cache.get('1105738078443798588').send(`DATABASE MIGRATION: ${newMember.nickname}, STATUS: ACCEPT!`)
        })
    }

}

// ================== HELP ============================

module.exports.help = {
    name: 'guildMemberUpdate',
    description: 'Обновление пользователя'
}
