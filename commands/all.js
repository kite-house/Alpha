const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = async (client, interaction, roles , text, check_permision, error_handling) => {
    if(!check_permision(client, interaction, 'Owner, Developer, Admin')) return

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

            } catch(error){
                client.users.cache.get(interaction.user.id).send(`Не удалось отправить сообщение пользователю <@${users[i]}>`)
            }
        }

        console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.commandName} | TO: ${roles.id} | STATUS:`, 'ACCEPT!'.green)

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
        
    } catch(error){
        error_handling(client, interaction, error)
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
        .setMinLength(1)
        .setMaxLength(255)
        .setRequired(true)
    )
}