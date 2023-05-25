const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')

module.exports = async (client, newRole, config) => {
    const AuditLogFetch = await newRole.guild.fetchAuditLogs({limit: 1})
    const Entry = AuditLogFetch.entries.first()
    console.log(`SERVER-INFO: CREATE_NEW_ROLE | INFO: ${newRole.name} | STATUS: ACCEPT!`)
    client.channels.cache.get(config.ds_server).send(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: newRole.guild.iconURL({Dynamic : true}) , name: newRole.guild.name})
            .setThumbnail(newRole.guild.iconURL({Dynamic : true}))
            .setTitle(`Создана новая роль!`)
            .setColor(Discord.Colors.Green)
            .setFields([
                {
                name: 'Название:',
                value : `${newRole.name}`,
                inline: true
                },
                {
                    name: 'Информация:',
                    value : `Создал: <@${Entry.executor.id}>`,
                }

            ])
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: `ID Role: ${newRole.id}`
            })
            .setTimestamp()
        ]})
}

// ================== HELP ============================

module.exports.help = {
    name : 'roleCreate',
    description : 'Создание новой роли'
}