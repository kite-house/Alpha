const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, config) => {
    if (interaction.channel.id != config.music) return interaction.reply(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
            .setThumbnail(client.user.avatarURL(client.user.avatar))
            .setColor(Discord.Colors.Red)
            .setTitle('Возникла ошибка!')
            .setDescription('Данную команду невозможно использовать в этом канале! Испольуйте https://discord.com/channels/1105726968260997120/1108219171814260816')
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username
            })
            .setTimestamp()
        ],ephemeral: true 
    })

    try{
        queue = client.DisTube.getQueue(interaction)
    } catch(err){
        if (err) console.log(err)
        if (err == "DisTubeError [NO_QUEUE]: There is no playing queue in this guild"){
            return interaction.reply(
                {embeds : [new EmbedBuilder()
                    .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
                    .setThumbnail(client.user.avatarURL(client.user.avatar))
                    .setColor(Discord.Colors.Red)
                    .setTitle('Возникла ошибка!')
                    .setDescription('В данный момент ничего не проигрывается!')
                    .setFooter({
                        iconURL : client.user.avatarURL(client.user.avatar),
                        text: client.user.username
                    })
                    .setTimestamp()
                ],ephemeral: true 
            })
        }
    }

    authors = ''
    names = ''
    durations = ""

    try {
        for (i in queue.songs){
            authors = authors + ' ' + queue.songs[i].uploader.name + '\n' + '---------------------------' + '\n'
            names = names + ' ' + queue.songs[i].name + '\n' + '---------------------------' + '\n'
            durations = durations + ' ' + queue.songs[i].formattedDuration + '\n' + '---------------------------' + '\n'

        }
    } catch(err){
        if (err){
            return interaction.reply(
                {embeds : [new EmbedBuilder()
                    .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
                    .setThumbnail(client.user.avatarURL(client.user.avatar))
                    .setColor(Discord.Colors.Red)
                    .setTitle('Возникла ошибка!')
                    .setDescription('Очередь пустая!')
                    .setFooter({
                        iconURL : client.user.avatarURL(client.user.avatar),
                        text: client.user.username
                    })
                    .setTimestamp()
                ],ephemeral: true })
        }
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