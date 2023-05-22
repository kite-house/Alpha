const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const {ButtonBuilder} = require('discord.js');


module.exports = (client, interaction, db, config) => {
    id_event = interaction.message.id
    text = ''

    db.query(`SELECT * FROM events WHERE id_events = '${id_event}'`, function(err, results) {
        if(err) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_QUEUE ${id_event}, STATUS: ${err}`);
        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_QUEUE ${id_event}, STATUS: ACCEPT!`)
        information = results[0].information
        participants = results[0].participants

        number = 0
        for (i in participants.split(', ')){
            number += 1
            text = text + `Номер: ${number}  //  <@${participants.split(', ')[i]}> \n` 
        }

        return interaction.reply({
            embeds : [new EmbedBuilder()
            .setTitle(`Список на мероприятие: ${information}`)
            .setDescription(text)
            .setColor(Discord.Colors.White)
            .setFields({
                name : 'Информация',
                value : `Начал регистрацию: <@${results[0].created}>`
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
