const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, names, channel) => {

    if (channel != "1108219171814260816") return interaction.reply(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
            .setThumbnail(client.user.avatarURL(client.user.avatar))
            .setColor(Discord.Colors.Red)
            .setTitle('Возникла ошибка')
            .setDescription('Данную команду невозможно использовать в этом канале! Испольуйте https://discord.com/channels/1105726968260997120/1108219171814260816')
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username
            })
            .setTimestamp()
        ],ephemeral: true 
    })

    if (interaction.member.voice.channel == null) return interaction.reply(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
            .setThumbnail(client.user.avatarURL(client.user.avatar))
            .setColor(Discord.Colors.Red)
            .setTitle('Возникла ошибка!')
            .setDescription('Для использование, зайдите в любой голосовой канал!')
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username
            })
            .setTimestamp()
        ],ephemeral: true 
    })

    interaction.deferReply({ephemeral: true });

    client.DisTube.play(interaction.member.voice.channel, names)


    client.DisTube.on('playSong', (queue, song) => {
        interaction.editReply(
            {embeds : [new EmbedBuilder()
                .setAuthor({iconURL: client.user.avatarURL(client.user.avatar), name: song.source})
                .setThumbnail(song.thumbnail)
                .setTitle(`${song.uploader.name}`)
                .setColor(Discord.Colors.Red)
                .setDescription(`[${song.name}](${song.url})`)
                .setFields([
                    {
                        name: 'Длительность',
                        value: `${song.formattedDuration}`,
                        inline: true
                    },
                    {
                        name: 'Включил',
                        value: `${interaction.user}`,
                        inline: true
                    }

                ])
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username + " • " + interaction.member.voice.channel
                })
                .setTimestamp()
            ]})
    })

}


module.exports.help = {
    name : 'play',
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Включить музыку!")
    .addStringOption(option => 
        option
        .setName('names')
        .setDescription('Введите ссылку/названия песни на YouTube')
        .setRequired(true)
        .setMinLength(1)
        )

}