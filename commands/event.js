const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = (client, interaction, name, time, date, text, check_permision) => {
    if (!check_permision(client, interaction)) return
    if (date == null){
        date = 'Сегодня'
    }

    if (text == null){
        text = 'Быть всем!'
    }
    
    interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(Discord.Colors.Green)
            .setTitle("Успешно!")
            .setDescription('Вы начали регистрацию учатников на мероприятие!')
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


    id_cnannel = '1109513252825739356'

    const go_event = new ButtonBuilder()
    .setCustomId(`go_event`)
    .setLabel('Участвовать!')
    .setDisabled(false)
    .setStyle(ButtonStyle.Success);

    const leave_event = new ButtonBuilder()
    .setCustomId(`leave_event`)
    .setLabel('Отменить участие!')
    .setDisabled(false)
    .setStyle(ButtonStyle.Danger);


    const row = new ActionRowBuilder()
    .addComponents(go_event, leave_event)

    message = client.channels.cache.get("1109513252825739356").send({
        embeds: [new EmbedBuilder()
            .setColor(Discord.Colors.Green)
            .setTitle("Сбор на мероприятие!")
            .setDescription(`${text}`)
            .setColor(Discord.Colors.White)
            .setFields({
                name : "Информация: ",
                value : `Дата: ${date}, Время: ${time}, Название: ${name}`
            })
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username + ' BOT'
            })
            .setTimestamp()
    ], components: [row]})

    //message.threads.create(message)
}


module.exports.help = {
    name : 'event',
    data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Начать регистрация на мероприятие!")
    .addStringOption(option => 
        option
        .setName('name')
        .setDescription("Название мероприятие")
        .setRequired(true)
    )
    .addStringOption(option => 
        option
        .setName('time')
        .setDescription("Время начало мероприятие")
        .setRequired(true)
    )
    .addStringOption(option => 
        option
        .setName("date")
        .setDescription("Дата проведения мероприятие(оставьте пустым если мероприятие пройдёт сегодня)")
        .setRequired(false)
    )
    .addStringOption(option => 
        option
        .setName('text')
        .setDescription("Допольнительный текст")
        .setRequired(false)
    )
}