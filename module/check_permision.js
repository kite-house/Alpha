const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')

module.exports = (client,interaction) => {
    function check_permision(){
        if (interaction.member._roles.find(element => element === '1105728071350353932') != undefined) return true
        if (interaction.member._roles.find(element => element === '1105727216882565180') != undefined) return true
        if (interaction.member._roles.find(element => element === '1105728629092139070') != undefined) return true
        else return false
    }

    if(!check_permision()){ interaction.reply({
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
    help : 'проверка на права'
}