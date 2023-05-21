const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')

module.exports = (client,interaction) => {
    try{
        permission = interaction.member.permissions.has('checkAdmin')
    } catch(err) {
        if (err = 'RangeError [BitFieldInvalid]: Invalid bitfield flag or number: checkAdmin.'){
            permission = false
        }
    }
    
     

    if(!permission){ interaction.reply({
        embeds : [new EmbedBuilder()
            .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
            .setThumbnail(client.user.avatarURL(client.user.avatar))
            .setColor(Discord.Colors.Red)
            .setTitle('Возникла ошибка!')
            .setDescription('Недостаточно прав для использование!')
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username
            })
            .setTimestamp()
        ], ephemeral: true });
    
    return false 

    } else return true
    
}

module.exports.help = {
    name : 'check_permision',
    help : 'Проверка на права администратора!'
}