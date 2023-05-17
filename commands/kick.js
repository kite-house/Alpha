const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, user, reason, check_permision) => {
    check_permision(client, interaction)
    if (reason == null){
        reason = 'не указана'
    }

    try{
        interaction.guild.members.cache.get(user.id).kick(reason)
    } catch(err){}

    interaction.reply(
        {embeds : [new EmbedBuilder()
        .setColor(Discord.Colors.Green)
        .setTitle("Вы успешно выгнали пользователя с сервера!")
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
    name : 'kick',
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Выгнать пользователя с сервера!")
    .addUserOption(option => 
        option
        .setName('user')
        .setDescription('Выберите пользователя!')
        .setRequired(true)
    )
    .addStringOption(option => 
        option
        .setName('reason')
        .setDescription('Введите причину!')
        .setRequired(false)
    )
}