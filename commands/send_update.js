const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction, version, text, config) => {
    if(interaction.user.id != config.developerId) return interaction.reply({
        embeds : [new EmbedBuilder()
            .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
            .setThumbnail(client.user.avatarURL(client.user.avatar))
            .setColor(Discord.Colors.Red)
            .setTitle('Возникла ошибка!')
            .setDescription('Недостаточно прав для использование!')
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username
            })
            .setTimestamp()
        ], ephemeral: true });

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

    datetime = new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" }).split(' ')
    if (datetime[2] == 'PM'){
        hours = parseInt(datetime[1].split(':')[0]) + 12
        datetime = `${datetime[0]} ${hours}:${datetime[1].split(':')[1]}`
    }
    else if (datetime[2] == 'AM'){
        hours = parseInt(datetime[1].split(':')[0])
        datetime = `${datetime[0]} ${hours}:${datetime[1].split(':')[1]}`
    }

    console.log(datetime)
    console.log(version)
    console.log(text)

    datetime = 'Сегодня'
    
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
            value: datetime,
            inline: true
        }
        )
        .setFooter({
            iconURL : client.user.avatarURL(client.user.avatar),
            text: client.user.username + '-BOT'
        })
        .setTimestamp()
        
    ]})

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