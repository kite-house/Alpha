const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, user, reason, check_permision) => {
    check_permision(client, interaction)
    if (reason == null){
        reason = 'не указана'
    }

    try{
        interaction.guild.members.cache.get(user.id).timeout(900, reason)
    } catch(err){}

    interaction.reply(
        {embeds : [new EmbedBuilder()
        .setColor(Discord.Colors.Green)
        .setTitle("Вы успешно сняли мут пользователю!")
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
            value : `Снял наказание: ${interaction.user}`
        })

        .setFooter({
            text : `ID User: ${user.id}`
        })
        .setTimestamp()
    ], ephemeral: true })
}


module.exports.help = {
    name : 'unmute',
    data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Снять мут пользователю!")
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