const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction, version, text, config, check_permision) => {
    if(!check_permision(client, interaction, 'Developer')) return

    text_edit = text.split(' || ')

    for (i in text_edit){
        text_edit[i] = text_edit[i] + '\n'
    }

    text = text_edit.toString()
    text = text.replaceAll(",", '')

    interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(Discord.Colors.Green)
            .setTitle("Успешно!")
            .setDescription('Вы опубликовали сообщение об обновление')
            .setColor(Discord.Colors.Green)
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username + ' BOT'
            })
            .setTimestamp()
    ], ephemeral: true})   

    datetime = date = new Date().toLocaleString('ru-RU', {timeZone: 'Europe/Moscow'}).split(',')[0]

    client.channels.cache.get(interaction.channel.id).send(
        {embeds : [new EmbedBuilder()
        .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
        .setThumbnail(client.user.avatarURL(client.user.avatar))
        .setTitle('Вышло новое обновление, Юху!!')
        .setColor(Discord.Colors.White)
        .setDescription(text)
        .addFields(
        {
            name: 'Версия',
            value: version,
            inline: true
        },
        {
            name: 'Дата обновления',
            value: date,
            inline: true
        }
        )
        .setFooter({
            iconURL : client.user.avatarURL(client.user.avatar),
            text: client.user.username + '-BOT'
        })
        .setTimestamp()
        
    ]})

    console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.commandName} | STATUS: ACCEPT!`)
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'send_update',
    data: new SlashCommandBuilder()
    .setName("send_update")
    .setDescription("Вывести сообщение об обновление!")
    .addStringOption(option => 
        option
        .setName('version')
        .setDescription("Версия обновления")
        .setRequired(true)
        .setMinLength(1)
        )
    .addStringOption(option => 
        option
        .setName("text")
        .setDescription("Текст сообщения")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(255)
        )
}