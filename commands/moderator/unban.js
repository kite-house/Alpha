const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction, user, reason, check_permision, error_handling) => {
    if(!check_permision(client, interaction, 'Owner, Developer, Admin')) return
    
    if (reason == null){
        reason = 'не указана'
    }

    await interaction.guild.members.unban(user)
        .then(() => {
            console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.commandName} | TO ${user.id} | STATUS:`, 'ACCEPT!'.green)
            interaction.reply(
                {embeds : [new EmbedBuilder()
                .setColor(Discord.Colors.Green)
                .setTitle("Вы успешно разбанили пользователя!")
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
    name : 'unban',
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Разбанить пользователя!")
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