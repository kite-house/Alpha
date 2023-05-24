const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const config = require('../config.json')

module.exports = (client,interaction) => {
    try{
        permission = interaction.member.permissions.has('Administration')
    } 
    catch (error) {
        if (error = 'RangeError [BitFieldInvalid]: Invalid bitfield flag or number: Administration.')
            if(interaction.user.id != config.developerId){
                permission = false
            }
            else if (interaction.user.id == config.developerId){
                permission = true
            }
    }

    if (!permission) {
        interaction.reply({
            embeds : [new EmbedBuilder()
                .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
                .setThumbnail(client.user.avatarURL(client.user.avatar))
                .setColor(Discord.Colors.Red)
                .setTitle('Возникла ошибка!')
                .setDescription('Недостаточно прав для использование')
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username
                })
                .setTimestamp()
            ], ephemeral: true }
        )
    return false
    }
    
    if(permission) return true
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'check_permision',
    help : 'Проверка на права администратора!'
}