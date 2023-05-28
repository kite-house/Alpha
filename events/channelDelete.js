const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')

module.exports = async (client, oldChannel, config) => {
    const AuditLogFetch = await oldChannel.guild.fetchAuditLogs({limit: 1})
    const Entry = AuditLogFetch.entries.first()

    if (oldChannel.type == 0){
        typeChannel = 'текстовой'
    }

    if (oldChannel.type == 2){
        typeChannel = 'голосовой'
    }

    console.log(`SERVER-INFO: DELETED_CHANNEL | TYPE: ${oldChannel.type} | NAME: ${oldChannel.name} | STATUS:`, 'ACCEPT!'.green)

    client.channels.cache.get(config.ds_server).send(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: oldChannel.guild.iconURL({Dynamic : true}) , name: oldChannel.guild.name})
            .setThumbnail(oldChannel.guild.iconURL({Dynamic : true}))
            .setTitle(`Удалён ${typeChannel} канал!`)
            .setColor(Discord.Colors.Red)
            .setFields([
                {
                name: 'Название:',
                value : `${oldChannel.name}`,
                inline: true
                },
                {
                    name: 'Информация:',
                    value : `Удалил: <@${Entry.executor.id}>`,
                }

            ])
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: `ID Channel: ${oldChannel.id}`
            })
            .setTimestamp()
        ]})
    
}

// ================== HELP ============================

module.exports.help = {
    name : 'channelDelete',
    description : 'Удаление канала'
}