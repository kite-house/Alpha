const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = (client, interaction, db, config, error_handling) => {
    const read = new ButtonBuilder()
        .setCustomId(`read_message`)
        .setLabel('Прочитал')
        .setDisabled(false)
        .setStyle(ButtonStyle.Secondary);

    let read_row = new ActionRowBuilder()
        .addComponents(read)

    db.query(`SELECT * FROM events WHERE id_event = '${interaction.message.id}'`, function(error, results) {
        if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${interaction.message.id}, STATUS: ${error}`);
        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${interaction.message.id}, STATUS: ACCEPT!`)
        names = results[0].names
        date = results[0].date
        participants = results[0].participants
        created = results[0].created
        time = results[0].time
        quantity = results[0].quantity
        limited = results[0].limited
        reserve = results[0].reserve

        if(participants.split(', ').find(element => element === interaction.user.id) == undefined){
            return error_handling(client, interaction, 'CustomError [Event]: And so not registered')
        }

        if (quantity >= limited){
            if (reserve != ''){
                if (participants == interaction.user.id){
                    participants = reserve.split(', ')[0]
                } else {
                    participants = participants.replace(interaction.user.id + ', ', '')
                    participants = participants.replace(', ' + interaction.user.id, '')
                    participants = participants + ', ' + reserve.split(', ')[0]
                }
                try{
                    client.users.cache.get(reserve.split(', ')[0]).send({
                        embeds: [new EmbedBuilder()
                            .setColor(Discord.Colors.White)
                            .setTitle('Кто-то отменил своё участие, вы автоматически стали участником мероприятие!')
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
                    client.users.cache.get(created).send(`Не удалось отправить сообщение пользователю <@${reserve.split(', ')[0]}>`)
                }

                if (reserve == reserve.split(', ')[0]){
                    reserve = ''
                } else {
                    reserve = reserve.replace(reserve.split(', ')[0] + ', ', '')
                    reserve = reserve.replace(', ' + reserve.split(', ')[0], '')
                }
            }
        }

        if (quantity < limited){
            quantity = quantity - 1

            if (participants == interaction.user.id){
                participants = ''
            } else {
                participants = participants.replace(interaction.user.id + ', ', '')
                participants = participants.replace(', ' + interaction.user.id, '')
            }
        }

        db.query(`UPDATE events SET participants = '${participants}', reserve = '${reserve}' ,quantity = '${quantity}' WHERE id_event = '${interaction.message.id}'`, function(error, results) {
            if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${interaction.message.id}, STATUS: ${error}`);
            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT_LEAVE ${interaction.message.id}, STATUS: ACCEPT!`)
        })

        console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.customId} | STATUS:`, 'ACCEPT!'.green)

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