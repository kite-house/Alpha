const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction, user, reason, check_permision) => {
    if(!check_permision(client, interaction)) return
    
    if (reason == null){
        reason = 'не указана'
    }

    await interaction.guild.members.unban(user)
        .then(() => {
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
            if (error == "DiscordAPIError[50013]: Missing Permissions"){
                return interaction.reply({
                    embeds: [new EmbedBuilder()
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
                    ], ephemeral: true }
                )
            }

            if (error == "DiscordAPIError[10026]: Unknown Ban"){
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
                        .setThumbnail(client.user.avatarURL(client.user.avatar))
                        .setColor(Discord.Colors.Red)
                        .setTitle('Возникла ошибка!')
                        .setDescription('Пользователь не находится в бане!')
                        .setFooter({
                            iconURL : client.user.avatarURL(client.user.avatar),
                            text: client.user.username
                        })
                        .setTimestamp()
                    ], ephemeral: true }
                )
            }

            else {
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
                        .setThumbnail(client.user.avatarURL(client.user.avatar))
                        .setColor(Discord.Colors.Red)
                        .setTitle('Возникла ошибка!')
                        .setDescription(`${error}`)
                        .setFooter({
                            iconURL : client.user.avatarURL(client.user.avatar),
                            text: client.user.username
                        })
                        .setTimestamp()
                    ], ephemeral: true }
                )
            }
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