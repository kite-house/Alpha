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
        }



        number = 0
        for (i in participants.split(', ')){
            number += 1
            text = text + `Номер: ${number}  //  <@${participants.split(', ')[i]}> \n` 
        }

        return interaction.reply({
            embeds : [new EmbedBuilder()
            .setTitle(`Список на мероприятие: ${information}, ${time}`)
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
