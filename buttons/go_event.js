const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = (client, interaction) => {
    console.log(interaction)
    interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(Discord.Colors.Green)
            .setTitle("Успешно!")
            .setDescription('Вы зарегистрировались на мероприятие')
            .setColor(Discord.Colors.Green)
            .setFields({
                name : "Информация: ",
                value : `Дата: ${date}, Время: ${time}, Название: ${name}`
            })
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username + ' BOT'
            })
            .setTimestamp()
    ], ephemeral: true})   
}

module.exports.help = {
    name : 'go_event',
    data: new SlashCommandBuilder()
    .setName("go_event")
    .setDescription("Зарегистрироваться на мероприятие!")
}
