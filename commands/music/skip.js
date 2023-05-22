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
            .setDescription(`Данную команду невозможно использовать в этом канале! Испольуйте https://discord.com/channels/${config.id_server_test}/${config.music}`)
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username
            })
            .setTimestamp()
        ],ephemeral: true 
    })

    client.DisTube.skip(interaction)
        .then(() => {
            interaction.reply(
                {embeds : [new EmbedBuilder()
                    .setTitle(`Успешно!`)
                    .setColor(Discord.Colors.Green)
                    .setDescription(`Вы переключились на следующию песню!`)
                    .setFooter({
                        iconURL : client.user.avatarURL(client.user.avatar),
                        text: client.user.username + " • " + interaction.member.voice.channel
                    })
                    .setTimestamp()
                ],ephemeral: true    
            })
        })

        .catch(error => {
            if (error == "DisTubeError [NO_QUEUE]: There is no playing queue in this guild"){
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
            else {
                return interaction.reply(
                    {embeds : [new EmbedBuilder()
                        .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
                        .setThumbnail(client.user.avatarURL(client.user.avatar))
                        .setColor(Discord.Colors.Red)
                        .setTitle('Возникла ошибка!')
                        .setDescription(`${error}`)
                        .setFooter({
                            iconURL : client.user.avatarURL(client.user.avatar),
                            text: client.user.username
                        })
                        .setTimestamp()
                    ],ephemeral: true 
                })
            }
        }
    ) 
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'skip',
    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Пропустить песню!")
}