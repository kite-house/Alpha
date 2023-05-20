const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, user, reason, check_permision) => {
    if(!check_permision(client, interaction)) return
    if (reason == null){
        reason = 'не указана'
    }

    try{
        interaction.guild.members.cache.get(user.id).ban({reason})
    } catch(err){}

    interaction.reply(
        {embeds : [new EmbedBuilder()
        .setColor(Discord.Colors.Green)
        .setTitle("Вы успешно забанили пользователя!")
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
    name : 'ban',
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Забанить пользователя!")
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