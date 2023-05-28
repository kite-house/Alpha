const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const adjustment = require('./adjustment')

module.exports = (client, datetime, db, config) => {
    const read = new ButtonBuilder()
        .setCustomId(`read_message`)
        .setLabel('Прочитал')
        .setDisabled(false)
        .setStyle(ButtonStyle.Secondary);

    let read_row = new ActionRowBuilder()
        .addComponents(read)

    db.query("SELECT * FROM events WHERE `status` = 'active'", function(error, results) {
        if(error) return console.log(error)
        if (results == '') return 
        let status;

        for (i in results){
            names = results[i].names
            date = results[i].date
            time = results[i].time
            created = results[i].created
            status = results[i].status
            id_event = results[i].id_event
            participants = results[i].participants
            time = adjustment(time)

            if (datetime >= `${date}, ${time}`){
                db.query("UPDATE `events` SET `status`= 'closed' WHERE `id_event` = " + id_event)
                console.log(`MODULE_INFO: END_REGISTRAION_EVENT | INFO: ${id_event} | STATUS:`, 'ACCEPT!'.green)
                client.channels.cache.get(config.reg_event).messages.fetch(id_event)
                .then(message => {
                    row = message.components[0]
                    row.components[0] = ButtonBuilder.from(row.components[0]).setDisabled(true)
                    row.components[1] = ButtonBuilder.from(row.components[1]).setDisabled(true)
                    message.edit({ components: [row] });
                })
                .catch(error => console.error(error));

                users = participants.split(', ')
                for (i in users){
                    try{
                        client.users.cache.get(users[i]).send({
                            embeds: [new EmbedBuilder()
                                .setColor(Discord.Colors.White)
                                .setTitle('Мероприятие начнётся через 30 минут! Начинаем заходить в войс и в игру!')
                                .setFields({
                                    name : "Информация: ",
                                    value : `${names} // ${date} // ${time}`
                                })
                                .setFooter({
                                    iconURL : client.user.avatarURL(client.user.avatar),
                                    text: client.user.username + 'BOT'
                                })
                                .setTimestamp()
                        ], components: [read_row]})
                    } catch(error){
                        client.users.cache.get(created).send(`Не удалось отправить сообщение пользователю <@${users[i]}>`)
                    }
                }
            }
        }
    })
}


// ====================== HELP ==============================

module.exports.help = {
    name : 'end_reg_event',
    help : 'Завершение регистрации по достижение времени'
}