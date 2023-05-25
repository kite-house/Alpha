const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, config, error_handling) => {
    if (interaction.channel.id != config.music) return error_handling(client, interaction, "CustomError [Music]: Incorrect text chat")

    queue = client.DisTube.getQueue(interaction)
        .catch(error => {
            error_handling(client, interaction, error)
        })

    authors = ''
    names = ''
    durations = ""

    try {
        for (i in queue.songs){
            authors = authors + ' ' + queue.songs[i].uploader.name + '\n' + '---------------------------' + '\n'
            names = names + ' ' + queue.songs[i].name + '\n' + '---------------------------' + '\n'
            durations = durations + ' ' + queue.songs[i].formattedDuration + '\n' + '---------------------------' + '\n'

        }
    } catch(error){
        error_handling(client, interaction, error)

    }
    
    interaction.reply(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: client.user.avatarURL(client.user.avatar), name: 'Очередь воспроизведения:'})
            //.setThumbnail(song.thumbnail)
            //.setTitle(`${song.uploader.name}`)
            .setColor(Discord.Colors.Red)
            .setFields([
                {
                    name: 'Автор',
                    value: `${authors}`,
                    inline: true
                },
                {
                    name: 'Название',
                    value: `${names}`,
                    inline: true
                },
                {
                    name: 'Длительность',
                    value: `${durations}`,
                    inline: true
                },
            ])
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username + " • " + interaction.member.voice.channel
            })
            .setTimestamp()
        ],ephemeral: true })

}

// ====================== HELP ==============================

module.exports.help = {
    name : 'queue',
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Посмотреть очередь.")
}