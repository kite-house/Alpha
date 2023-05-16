const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, value) => {
    function check_permision(){
        if (interaction.member._roles.find(element => element === '1105728071350353932') != undefined) return true
        if (interaction.member._roles.find(element => element === '1105727216882565180') != undefined) return true
        if (interaction.member._roles.find(element => element === '1105728629092139070') != undefined) return true
        else return false
    }

    if(!check_permision()) return interaction.reply({
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

    interaction.channel.bulkDelete(value).then(() => {
        interaction.reply(
            {embeds : [new EmbedBuilder()
                .setColor(Discord.Colors.Green)
                .setDescription(`Удалено ${value} сообщений!`)
            ], ephemeral: true })
    });
}
// ================== HELP ============================

module.exports.help = {
    name : 'clear',
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Удалить до 100 собщений в любом канале!")
    .addIntegerOption(option => 
        option
        .setName('value')
        .setDescription('Количество удаляймых сообщение от 1 до 100!')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
}