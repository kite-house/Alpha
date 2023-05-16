const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')

module.exports = async (client, oldUser, db, audit) => {
    const AuditLogFetch = await oldUser.guild.fetchAuditLogs({limit: 1})
    const Entry = AuditLogFetch.entries.first()

    client.channels.cache.get(audit).send(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: oldUser.user.avatarURL(oldUser.user.avatar) , name: `${oldUser.user.username}#${oldUser.user.discriminator}`})
            .setThumbnail(oldUser.user.avatarURL(oldUser.user.avatar))
            .setTitle(`Пользователь покинул сервер!`)
            .setDescription(`Участник <@${oldUser.id}>`)
            .setColor(Discord.Colors.Red)
            .setFields({
                name : "Информация: ",
                value : `Выгнал: <@${Entry.executor.id}>`
            })
            .setTimestamp()
        ]})

    db.query(`DELETE FROM users WHERE discord_id = ${oldUser.id}`, function(err,results){
        if(err) client.channels.cache.get('1105738078443798588').send(`DATABASE MIGRATION: ${oldUser.nickname}, STATUS: FAIL!`);
        client.channels.cache.get('1105738078443798588').send(`DATABASE MIGRATION: ${oldUser.nickname}, STATUS: ACCEPT!`)
    })
}

module.exports.help = {
    name: "guildMemberRemove",
    description: "Обработка старого юзера"
}