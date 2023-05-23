const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ButtonBuilder } = require('discord.js');

module.exports = (client, interaction, db, config) => {
    
    id_event = interaction.message.id

    db.query(`SELECT * FROM events WHERE id_events = '${id_event}'`, function(err, results) {
        if(err) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${id_event}, STATUS: ${err}`);
        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${id_event}, STATUS: ACCEPT!`)
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

        if(participants.split(', ').find(element => element === interaction.user.id) == undefined){
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(Discord.Colors.Red)
                    .setTitle("Возникла ошибка!")
                    .setDescription('Вы и так не зарегистрированы на меропрятие!')
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
        
        quantity = quantity - 1

        if (participants == interaction.user.id){
            participants = ''
        } else {
            participants = participants.replace(interaction.user.id + ', ', '')
            participants = participants.replace(', ' + interaction.user.id, '')
        }

        db.query(`UPDATE events SET participants = '${participants}', quantity = '${quantity}' WHERE id_events = '${id_event}'`, function(err, results) {
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
    name : 'leave_event',
    data: new ButtonBuilder()
    .setCustomId("leave_event")
    .setLabel('Отменить участие!')
}