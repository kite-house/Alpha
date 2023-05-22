const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = async (client, interaction, roles , text, check_permision) => {
    if (!check_permision(client, interaction)) return

    await interaction.deferReply({ephemeral: true});
    const read = new ButtonBuilder()
    .setCustomId(`read_message`)
    .setLabel('Прочитал')
    .setDisabled(false)
    .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
    .addComponents(read)

    try{
        users = roles.members.map(m=>m.user.id)
        for (i in users){
            try{
                await client.users.cache.get(users[i]).send({
                    embeds: [new EmbedBuilder()
                        .setColor(Discord.Colors.White)
                        .setTitle(text)
                        .setDescription(`Отправил: <@${interaction.user.id}>`)
                        .setFooter({
                            iconURL : client.user.avatarURL(client.user.avatar),
                            text: client.user.username + 'BOT'
                        })
                        .setTimestamp()
                ], components: [row]})

            } catch(err){
                client.users.cache.get(interaction.user.id).send(`Не удалось отправить сообщение пользователю <@${users[i]}>`)
            }
        }

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setTitle("Успешно!")
                .setDescription('Вы тегнули всех выбранных участников!')
                .setColor(Discord.Colors.Green)
                .setFields({
                    name : "Информация: ",
                    value : `Роль: <@&${roles.id}>, Кол-во участников: ${users.length}`
                })
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username + 'BOT'
                })
                .setTimestamp()
        ], ephemeral: true})
        
    } catch(err){
        return interaction.editReply(
            {embeds : [new EmbedBuilder()
                .setAuthor({iconURL: client.user.avatarURL(client.user.avatar) , name: `${client.user.username}#${client.user.discriminator}`})
                .setThumbnail(client.user.avatarURL(client.user.avatar))
                .setColor(Discord.Colors.Red)
                .setTitle('Возникла ошибка!')
                .setDescription(`Ошибка: ${err}`)
                .setFooter({
                    iconURL : client.user.avatarURL(client.user.avatar),
                    text: client.user.username
                })
                .setTimestamp()
            ],ephemeral: true 
        })
    }
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'all',
    data: new SlashCommandBuilder()
    .setName("all")
    .setDescription("Тэгнуть определённую часть!")
    .addRoleOption(option => 
        option
        .setName('roles')
        .setDescription("Выберите роль которую хотите тэгнуть!")
        .setRequired(true)
        )

    .addStringOption(option => 
        option
        .setName('text')
        .setDescription("Введите текст который вы хотите отправить другим участникам!")
        .setRequired(true)
    )
}