const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, value, check_permision) => {
    if(!check_permision(client, interaction)) return
    interaction.channel.bulkDelete(value).then(() => {
        interaction.reply(
            {embeds : [new EmbedBuilder()
                .setColor(Discord.Colors.Green)
                .setDescription(`Удалено ${value} сообщений!`)
            ], ephemeral: true })
    });
}

// ====================== HELP ==============================

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