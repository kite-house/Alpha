const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = (client, interaction, db, config) => {
    
    id_event = interaction.message.id

    db.query(`SELECT * FROM events WHERE id_events = '${id_event}'`, function(err, results) {
        if(err) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${id_event}, STATUS: ${err}`);
        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${id_event}, STATUS: ACCEPT!`)
        information = results[0].information
        participants = results[0].participants

        for (i in participants.split(', ')){
            if(participants.split(', ')[i] != interaction.user.id){
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(Discord.Colors.Red)
                        .setTitle("Возникла ошибка!")
                        .setDescription('Вы и так не зарегистрированы на меропрятие!')
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

        if (participants == interaction.user.id){
            participants = ''
        } else {
            participants = participants.replace(interaction.user.id + ', ', '')
        }

        db.query(`UPDATE events SET participants = '${participants}' WHERE id_events = '${id_event}'`, function(err, results) {
            if(err) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${id_event}, STATUS: ${err}`);
            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${id_event}, STATUS: ACCEPT!`)
        })

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle("Успешно!")
                .setDescription('Вы отменили своё участие в мероприятие!')
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

module.exports.help = {
    name : 'leave_event',
    data: new SlashCommandBuilder()
    .setName("leave_event")
    .setDescription("Отменить участие на мероприятие!")
}
