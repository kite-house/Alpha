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
        client.DisTube.previous(interaction)
    } catch(err){
        if (err == "DisTubeError [NO_QUEUE]: There is no playing queue in this guild"){
            return interaction.reply(
                {embeds : [new EmbedBuilder()
                    .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
                    .setThumbnail(client.user.avatarURL(client.user.avatar))
                    .setColor(Discord.Colors.Red)
                    .setTitle('Возникла ошибка!')
                    .setDescription('Ничего ранее не проигровалось!')
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
            .setDescription(`Вы переключились на предыдушую песню!`)
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username + " • " + interaction.member.voice.channel
            })
            .setTimestamp()
        ],ephemeral: true    
    })
   

}

// ====================== HELP ==============================

module.exports.help = {
    name : 'back',
    data: new SlashCommandBuilder()
    .setName("back")
    .setDescription("Воспроизвести предыдущую песню!")
}