const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = (client, interaction, db, config) => {
    
    id_event = interaction.message.id

    db.query(`SELECT * FROM events WHERE id_events = '${id_event}'`, function(err, results) {
        if(err) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${id_event}, STATUS: ${err}`);
        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${id_event}, STATUS: ACCEPT!`)
        information = results[0].information
        participants = results[0].participants

        for (i in participants.split(', ')){
            if(participants.split(', ')[i] == interaction.user.id){
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(Discord.Colors.Red)
                        .setTitle("Возникла ошибка!")
                        .setDescription('Вы уже зарегистрированы на мероприятие!')
                        .setFields({
                            name : "Информация: ",
                            value : `${information}`
                        })
                        .setFooter({
                            iconURL : client.user.avatarURL(client.user.avatar),
                            text: client.user.username + ' BOT'
                        })
                        .setTimestamp()
                ], ephemeral: true})
            }
        }

        if (participants == ''){
            participants = interaction.user.id
        } else {
            participants = participants + ', ' + interaction.user.id
        }

        db.query(`UPDATE events SET participants = '${participants}' WHERE id_events = '${id_event}'`, function(err, results) {
            if(err) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${id_event}, STATUS: ${err}`);
            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${id_event}, STATUS: ACCEPT!`)
        })

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(Discord.Colors.Green)
                .setTitle("Успешно!")
                .setDescription('Вы зарегистрировались на мероприятие')
                .setColor(Discord.Colors.Green)
                .setFields({
                    name : "Информация: ",
                    value : `${information}`
                })
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username + ' BOT'
                })
                .setTimestamp()
        ], ephemeral: true})   

    })
}

/*
module.exports.help = {
    name : 'go_event',
    data: new ButtonBuilder()
    .setName("go_event")
    .setDescription("Зарегистрироваться на мероприятие!")
}
*/

module.exports.help = {
    name : 'go_event',
    data: new ButtonBuilder()
    .setCustomId('go_event')
    .setLabel('Участвовать!')
}