const {ButtonBuilder} = require('discord.js');

module.exports = (client, interaction, config, error_handling) => {
    client.channels.cache.get(config.log_read_all).send(`<@${interaction.user.id}> нажал кнопку прочитать!`)
    interaction.message.delete()
        .catch(error => {
            error_handling(client, interaction, error)
        })
    console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.customId} | STATUS: ACCEPT!`)
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'read_message',
    data: new ButtonBuilder()
    .setCustomId('read_message')
    .setLabel('Прочитать!')
}