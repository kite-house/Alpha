const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction, user, reason, check_permision, error_handling) => {
    if(!check_permision(client, interaction, 'Owner, Developer, Admin')) return
    if(interaction.guild.members.cache.get(user.id) == undefined) return error_handling(client, interaction, 'CustomError [Moderator]: The user is not on the server')

    if (reason == null){
        reason = 'не указана'
    }

    await interaction.guild.members.cache.get(user.id).timeout(900, reason)
        .then(() => {
            console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.commandName} | TO ${user.id} | STATUS: ACCEPT!`)
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
        })
        .catch(error => {
            error_handling(client, interaction, error)
        }
    )
}

// ====================== HELP ==============================

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