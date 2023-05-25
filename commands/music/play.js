const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction, names, config, error_handling) => {
    if (interaction.channel.id != config.music) return error_handling(client, interaction, 'CustomError [Music]: Incorrect text chat')
    if (interaction.member.voice.channel == null) return error_handling(client, interaction, 'CustomError [Music]: Not in voice channel')

    await interaction.deferReply({ephemeral: true});

    client.DisTube.play(interaction.member.voice.channel, names)

    await client.DisTube.on('addSong', (queue, song) => {
        return interaction.editReply(
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
                        name: 'Добавил в очередь',
                        value: `${interaction.user}`,
                        inline: true
                    }

                ])
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username + " • " + interaction.member.voice.channel.name
                })
                .setTimestamp()
            ]})
    })


    await client.DisTube.on('playSong', (queue, song) => {
        return interaction.editReply(
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
                    text: client.user.username + " • " + interaction.member.voice.channel.name
                })
                .setTimestamp()
            ]})
    })

}

// ====================== HELP ==============================

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