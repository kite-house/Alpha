const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')


module.exports = async (client, upChannel, audit) => {
    const AuditLogFetch = await upChannel.guild.fetchAuditLogs({limit: 1})
    const Entry = AuditLogFetch.entries.first()

    if (upChannel.type == 0){
        typeChannel = 'текстовой'
    }

    if (upChannel.type == 2){
        typeChannel = 'голосовой'
    }
    client.channels.cache.get(audit).send(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: upChannel.guild.iconURL({Dynamic : true}) , name: upChannel.guild.name})
            .setThumbnail(upChannel.guild.iconURL({Dynamic : true}))
            .setTitle(`Обновлен ${typeChannel} канал!`)
            .setColor(Discord.Colors.DarkAqua)
            .setFields([
                {
                name: 'Название:',
                value : `${upChannel.name}`,
                inline: true
                },
                {
                    name: 'Информация:',
                    value : `Обновил: <@${Entry.executor.id}>`,
                }

            ])
            .setFooter({
                text: `ID Channel: ${upChannel.id}`
            })
            .setTimestamp()
        ]})
}

// ================== HELP ============================

module.exports.help = {
    name : 'channelUpdate',
    description : 'Обновление каналов'
}