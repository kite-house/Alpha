const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction) => {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    await interaction.reply(
        {embeds : [new EmbedBuilder()
        .setColor(Discord.Colors.White)
        .setFields(
        {
            name : 'Пинг бота',
            value : `${Date.now() - interaction.createdTimestamp} мс`,
            inline : true
        },
        {
            name : 'Время работы',
            value : `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
            inline : true
        })
    ], ephemeral: true })

}

// ================== HELP ============================

module.exports.help = {
    name : 'ping',
    description : 'Проверочка',
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("ping-pong")
}