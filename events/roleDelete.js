const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')

module.exports = async (client, oldRole, config) => {
    const AuditLogFetch = await oldRole.guild.fetchAuditLogs({limit: 1})
    const Entry = AuditLogFetch.entries.first()
    client.channels.cache.get(config.ds_server).send(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: oldRole.guild.iconURL({Dynamic : true}) , name: oldRole.guild.name})
            .setThumbnail(oldRole.guild.iconURL({Dynamic : true}))
            .setTitle(`Удалена роль!`)
            .setColor(Discord.Colors.Red)
            .setFields([
                {
                name: 'Название:',
                value : `${oldRole.name}`,
                inline: true
                },
                {
                    name: 'Информация:',
                    value : `Удалил: <@${Entry.executor.id}>`,
                }

            ])
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: `ID Role: ${oldRole.id}`
            })
            .setTimestamp()
        ]})
}

// ================== HELP ============================

module.exports.help = {
    name : 'roleDelete',
    description : 'Удаление ролей'
}