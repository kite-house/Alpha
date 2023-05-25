const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ButtonBuilder } = require('discord.js');

module.exports = (client, interaction, db, config, error_handling) => {
    db.query(`SELECT * FROM events WHERE id_event = '${interaction.message.id}'`, function(error, results) {
        if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${interaction.message.id}, STATUS: ${error}`);
        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${interaction.message.id}, STATUS: ACCEPT!`)
        names = results[0].names
        date = results[0].date
        participants = results[0].participants
        time = results[0].time
        quantity = results[0].quantity
        limited = results[0].limited

        if(participants.split(', ').find(element => element === interaction.user.id) == undefined){
            return error_handling(client, interaction, 'CustomError [Event]: And so not registered')
        }
        
        quantity = quantity - 1

        if (participants == interaction.user.id){
            participants = ''
        } else {
            participants = participants.replace(interaction.user.id + ', ', '')
            participants = participants.replace(', ' + interaction.user.id, '')
        }

        db.query(`UPDATE events SET participants = '${participants}', quantity = '${quantity}' WHERE id_event = '${interaction.message.id}'`, function(error, results) {
            if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${interaction.message.id}, STATUS: ${error}`);
            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${interaction.message.id}, STATUS: ACCEPT!`)
        })

        console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.customId} | STATUS: ACCEPT!`)

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle("Успешно!")
                .setDescription('Вы отменили своё участие в мероприятие!')
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
    name : 'leave_event',
    data: new ButtonBuilder()
    .setCustomId("leave_event")
    .setLabel('Отменить участие!')
}