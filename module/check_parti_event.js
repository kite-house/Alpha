const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')

module.exports = (client, datetime, db, config) => {
    missing = ''
    db.query("SELECT * FROM events WHERE `date` = " + `'${datetime.split(', ')[0]}'`, function(error, results) {
        if(error) return console.log(error)
        if (results == '') return 

        for (i in results){
            console.log('тут')
            names = results[i].names
            date = results[i].date
            time = results[i].time
            created = results[i].created
            id_event = results[i].id_event
            participants = results[i].participants

            if (datetime == `${date}, ${time}:00`){
                if (participants == '') return
                users = participants.split(', ')

                for (i in users){
                    if (client.guilds.cache.get(config.id_server_main).members.cache.get(users[i]).voice.channel == null){
                        if (missing == ''){
                            missing = users[i]
                        } else {
                            missing = missing + ', ' + users[i]
                        }
                        
                    } 
                }

                if (missing != ''){
                    number = 0
                    text = ''

                    for (i in missing.split(', ')){
                        number += 1
                        text = text + `Номер: ${number}  //  <@${missing.split(', ')[i]}> \n` 
                    }
            
                    for (i in users){
                        if(missing.split(", ").find(element => element === users[i]) != undefined){
                            if (participants == users[i]){
                                participants = ''
                            } else {
                                participants = participants.replace(users[i] + ', ', '')
                                participants = participants.replace(', ' + users[i], '')
                            }
                        }
                    }

                    try{
                        client.users.cache.get(created).send({
                            embeds : [new EmbedBuilder()
                                .setTitle(`Список прогулщиков мероприятия: ${names} // ${date} // ${time}`)
                                .setDescription(text)
                                .setColor(Discord.Colors.White)
                                .setFields({
                                    name : 'Информация',
                                    value : `Данные лица, зарегистрировались на мероприятие, но не зашли в голосовой канал`
                                })
                                .setFooter({
                                    iconURL : client.user.avatarURL(client.user.avatar),
                                    text: client.user.username + ' BOT'
                                })
                                .setTimestamp()
                                ], ephemeral: true}
                        )
                    } catch(error){}

                    quantity = participants.split(', ').length
                    console.log(`INTERACTION_INFO: CHECK_PARTI_EVENT | INFO: ${id_event} | STATUS: DETECTED!`)
                    db.query(`UPDATE events SET participants = '${participants}', quantity = '${quantity}' WHERE id_event = '${id_event}'`, function(error, results) {
                        if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${id_event}, STATUS: ${error}`);
                        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_REG ${id_event}, STATUS: ACCEPT!`)
                    })
                }
            }
        }
    })
}



// ====================== HELP ==============================

module.exports.help = {
    name : 'check_parti_event',
    help : 'Проверка нахождения участников мероприятия в голосовом канале'
}