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
        time = results[0].time
        quantity = results[0].quantity
        limited = results[0].limited

        datetime = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"}).split(' ')
        if (datetime[2] == 'PM'){
            hours = parseInt(datetime[1].split(':')[0]) + 12
            datetime = `${datetime[0]} ${hours}:${datetime[1].split(':')[1]}`
        }
        else if (datetime[2] == 'AM'){
            hours = parseInt(datetime[1].split(':')[0])
            datetime = `${datetime[0]} ${hours}:${datetime[1].split(':')[1]}`
        }
        
        setTimeout(function() {}, 300);
        
        if (datetime >= `${information.split('| ')[1]}, ${time}`){
            row = interaction.message.components[0]
            row.components[0] = ButtonBuilder.from(row.components[0]).setDisabled(true)
            row.components[1] = ButtonBuilder.from(row.components[1]).setDisabled(true)
            interaction.message.edit({ components: [row] });
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(Discord.Colors.Red)
                    .setTitle("Возникла ошибка!")
                    .setDescription('Вы не успели, регистрация на мероприятие уже закончилась!')
                    .setFields({
                        name : "Информация: ",
                        value : `${information} // Время: ${time}`
                    })
                    .setFooter({
                        iconURL : client.user.avatarURL(client.user.avatar),
                        text: client.user.username + ' BOT'
                    })
                    .setTimestamp()
            ], ephemeral: true})
        }

        for (i in participants.split(', ')){
            if(participants.split(', ')[i] == interaction.user.id){
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(Discord.Colors.Red)
                        .setTitle("Возникла ошибка!")
                        .setDescription('Вы уже зарегистрированы на мероприятие!')
                        .setFields({
                            name : "Информация: ",
                            value : `${information} // Время: ${time}`
                        })
                        .setFooter({
                            iconURL : client.user.avatarURL(client.user.avatar),
                            text: client.user.username + ' BOT'
                        })
                        .setTimestamp()
                ], ephemeral: true})
            }
        }

        if (quantity >= limited){
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(Discord.Colors.Red)
                    .setTitle("Возникла ошибка!")
                    .setDescription('Превышен лимит участников на мероприятие!')
                    .setFields({
                        name : "Информация: ",
                        value : `${information} // Время: ${time}`
                    })
                    .setFooter({
                        iconURL : client.user.avatarURL(client.user.avatar),
                        text: client.user.username + ' BOT'
                    })
                    .setTimestamp()
            ], ephemeral: true})
        }

        quantity = quantity + 1

        if (participants == ''){
            participants = interaction.user.id
        } else {
            participants = participants + ', ' + interaction.user.id
        }

        db.query(`UPDATE events SET participants = '${participants}', quantity = '${quantity}' WHERE id_events = '${id_event}'`, function(err, results) {
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
                    value : `${information} // Время: ${time}`
                })
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username + ' BOT'
                })
                .setTimestamp()
        ], ephemeral: true})   

    })
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'go_event',
    data: new ButtonBuilder()
    .setCustomId('go_event')
    .setLabel('Участвовать!')
}