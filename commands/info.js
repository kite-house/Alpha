const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, config) => {
    interaction.reply(
        {embeds : [new EmbedBuilder()
        .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
        .setThumbnail(client.user.avatarURL(client.user.avatar))
        .setTitle('Информация об Morphy-BOT')
        .setColor(Discord.Colors.Yellow)
        .setDescription("Данный бот был разработан специально для семьи Morphy!")
        .addFields(
        {
            name: 'Разработчик',
            value: `<@${config.developerId}> (Данил)`,
            inline: true
        },
        {
            name: 'Поддержать разработчика',
            value: '[КЛИК](https://www.donationalerts.com/r/kite_dev)',
            inline: true
        }
        )
        .setFooter({
            iconURL : client.user.avatarURL(client.user.avatar),
            text: client.user.username + '-BOT'
        })
        .setTimestamp()
        
    ], ephemeral: true })

    console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.commandName} | STATUS: ACCEPT!`)
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'info',
    data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Посмотреть тайную информацию")
}