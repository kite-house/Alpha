const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const {ButtonBuilder} = require('discord.js');


module.exports = async (client, interaction, db, config, error_handling) => {
    db.query(`SELECT * FROM events WHERE id_event = '${interaction.message.id}'`, function(error, results) {
        if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_QUEUE ${interaction.message.id}, STATUS: ${error}`);
        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_QUEUE ${interaction.message.id}, STATUS: ACCEPT!`)
        names = results[0].names
        date = results[0].date
        participants = results[0].participants
        time = results[0].time
        quantity = results[0].quantity
        limited = results[0].limited
        text = ''
        number = 0

        for (i in participants.split(', ')){
            number += 1
            text = text + `Номер: ${number}  //  <@${participants.split(', ')[i]}> \n` 
        }

        console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.customId} | STATUS: ACCEPT!`)

        return interaction.reply({
            embeds : [new EmbedBuilder()
            .setTitle(`Список на мероприятие: ${names} // ${date} // ${time}`)
            .setDescription(text)
            .setColor(Discord.Colors.White)
            .setFields({
                name : 'Информация',
                value : `Начал регистрацию: <@${results[0].created}>, кол-во участников: (${quantity}/${limited})`
            })
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username + ' BOT'
            })
            .setTimestamp()
            ], ephemeral: true}
        )
    })
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'queue_event',
    data: new ButtonBuilder()
    .setCustomId("queue_event")
    .setLabel('Список')
}
