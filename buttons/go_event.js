const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const {ButtonBuilder} = require('discord.js');

module.exports = (client, interaction, db, config, error_handling) => {
    db.query(`SELECT * FROM events WHERE id_event = '${interaction.message.id}'`, function(error, results) {
        if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${interaction.message.id}, STATUS: ${error}`);
        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${interaction.message.id}, STATUS: ACCEPT!`)
        names = results[0].names
        date = results[0].date
        participants = results[0].participants
        time = results[0].time
        quantity = results[0].quantity
        limited = results[0].limited
        reserve = results[0].reserve

        if(participants.split(', ').find(element => element === interaction.user.id) != undefined){
            return error_handling(client, interaction, 'CustomError [Event]: And so already registered')
        }
        
        if (quantity >= limited){
            if (reserve == ''){
                reserve = interaction.user.id
            } else {
                reserve = participants + ', ' + interaction.user.id
            }
            db.query(`UPDATE events SET reserve = '${reserve}' WHERE id_event = '${interaction.message.id}'`, function(error, results) {
                if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${interaction.message.id}, STATUS: ${error}`);
                client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${interaction.message.id}, STATUS: ACCEPT!`)
            })
            return error_handling(client, interaction, 'CustomError [Event]: Exceeded the limit of participants')
        }

        quantity = quantity + 1

        if (participants == ''){
            participants = interaction.user.id
        } else {
            participants = participants + ', ' + interaction.user.id
        }
        
        db.query(`UPDATE events SET participants = '${participants}', reserve = '${reserve}', quantity = '${quantity}' WHERE id_event = '${interaction.message.id}'`, function(error, results) {
            if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${interaction.message.id}, STATUS: ${error}`);
            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${interaction.message.id}, STATUS: ACCEPT!`)
        })

        console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.customId} | STATUS: ACCEPT!`)

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(Discord.Colors.Green)
                .setTitle("Успешно!")
                .setDescription('Вы зарегистрировались на мероприятие')
                .setColor(Discord.Colors.Green)
                .setFields({
                    name : "Информация: ",
                    value : `${names} // ${date} // ${time}`
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