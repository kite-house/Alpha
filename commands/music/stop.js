const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, config) => {
    if (interaction.channel.id != config.music) return interaction.reply(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
            .setThumbnail(client.user.avatarURL(client.user.avatar))
            .setColor(Discord.Colors.Red)
            .setTitle('Возникла ошибка!')
            .setDescription('Данную команду невозможно использовать в этом канале! Испольуйте https://discord.com/channels/1105726968260997120/1108219171814260816')
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username
            })
            .setTimestamp()
        ],ephemeral: true 
    })

    try{
        client.DisTube.stop(interaction)
    } catch(err){
        if (err == "DisTubeError [NO_QUEUE]: There is no playing queue in this guild"){
            return interaction.reply(
                {embeds : [new EmbedBuilder()
                    .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
                    .setThumbnail(client.user.avatarURL(client.user.avatar))
                    .setColor(Discord.Colors.Red)
                    .setTitle('Возникла ошибка!')
                    .setDescription('В данный момент ничего не проигрывается!')
                    .setFooter({
                        iconURL : client.user.avatarURL(client.user.avatar),
                        text: client.user.username
                    })
                    .setTimestamp()
                ],ephemeral: true 
            })
        }
    } 
    
    interaction.reply(
        {embeds : [new EmbedBuilder()
            .setTitle(`Успешно!`)
            .setColor(Discord.Colors.Green)
            .setDescription(`Вы завершили проигрование песен!`)
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username + " • " + interaction.member.voice.channel.name
            })
            .setTimestamp()
        ],ephemeral: true    
    })
   

}

// ====================== HELP ==============================

module.exports.help = {
    name : 'stop',
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Выключить музыку!")
}