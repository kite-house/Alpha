const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, user, reason, time ,check_permision) => {
    check_permision(client, interaction)
    if (reason == null){
        reason = 'не указана'
    }

    try{
        interaction.guild.members.cache.get(user.id).timeout(time * 54000, reason)
    } catch(err){}

    interaction.reply(
        {embeds : [new EmbedBuilder()
        .setColor(Discord.Colors.Green)
        .setTitle("Вы успешно выдали мут пользователю!")
        .setFields(
        {
            name : 'Пользователь',
            value : `${user}`,
            inline : true
        },
        {
            name : 'Причина',
            value : `${reason}`,
            inline: true
        },
        {
            name : 'Время',
            value : `${time} минуты`,
            inline: true
        },
        {
            name : "Информация: ",
            value : `Выдал наказание: ${interaction.user}`
        })

        .setFooter({
            text : `ID User: ${user.id}`
        })
        .setTimestamp()
    ], ephemeral: true })
}


module.exports.help = {
    name : 'mute',
    data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Выдать мут пользователю!")
    .addUserOption(option => 
        option
        .setName('user')
        .setDescription('Выберите пользователя!')
        .setRequired(true)
    )
    .addIntegerOption(option =>
        option
        .setName('time')
        .setDescription('Укажите время наказание, в минутах. Максимальное значение 10080 - неделя!')
        .setMinValue(1)
        .setMaxValue(10080)
        .setRequired(true)
    )
    .addStringOption(option => 
        option
        .setName('reason')
        .setDescription('Введите причину!')
        .setRequired(false)
    )
}