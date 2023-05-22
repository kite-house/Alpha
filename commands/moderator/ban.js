const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction, user, reason, check_permision) => {
    if(!check_permision(client, interaction)) return

    if (reason == null){
        reason = 'не указана'
    }

    if(interaction.guild.members.cache.get(user.id) == undefined){
        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
                .setThumbnail(client.user.avatarURL(client.user.avatar))
                .setColor(Discord.Colors.Red)
                .setTitle('Возникла ошибка!')
                .setDescription('Участник не находится на сервере!')
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username
                })
                .setTimestamp()
            ], ephemeral: true }
        )
    }

    await interaction.guild.members.cache.get(user.id).ban({reason})
        .then(() => {
            interaction.reply(
                {embeds : [new EmbedBuilder()
                .setColor(Discord.Colors.Green)
                .setTitle("Вы успешно забанили пользователя!")
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
                    value : `Выдал наказание: ${interaction.user}`
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
    name : 'ban',
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Забанить пользователя!")
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