const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction, user, reason, time, check_permision, error_handling) => {
    if(!check_permision(client, interaction, 'Owner, Developer, Admin',)) return
    if(interaction.guild.members.cache.get(user.id) == undefined) return error_handling(client, interaction, 'CustomError [Moderator]: The user is not on the server')

    if (reason == null){
        reason = 'не указана'
    }

    await interaction.guild.members.cache.get(user.id).timeout(time * 54000, reason)
        .then(() => {
            console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.commandName} | TO ${user.id} | STATUS:`, 'ACCEPT!'.green)
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
        })
        .catch(error => {
            error_handling(client, interaction, error)
        }
    )
}

// ====================== HELP ==============================

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