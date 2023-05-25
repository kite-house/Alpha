const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')

module.exports = async (client, oldUser, db, config) => {
    const AuditLogFetch = await oldUser.guild.fetchAuditLogs({limit: 1})
    const Entry = AuditLogFetch.entries.first()
    console.log(`MEMBER-INFO: USER: ${newUser.user.id} | INFO: LEAVE | STATUS: ACCEPT!`)
    client.channels.cache.get(config.ds_member).send(
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

    db.query(`DELETE FROM users WHERE discord_id = ${oldUser.id}`, function(error,results){
        if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${oldUser.nickname}, STATUS: ${error}`);
        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${oldUser.nickname}, STATUS: ACCEPT!`)
    })
}

module.exports.help = {
    name: "guildMemberRemove",
    description: "Обработка старого юзера"
}