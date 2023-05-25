const { EmbedBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')

module.exports = (client, interaction, error) => {
    SysError = error
    if (error == 'DiscordAPIError[50013]: Missing Permissions'){
        error = 'Невозможно с этим пользователем!'
    }

    if (error == 'DiscordAPIError[10026]: Unknown Ban'){
        error = 'Пользовател не находится в бане!'
    }

    if (error == 'DisTubeError [NO_QUEUE]: There is no playing queue in this guild'){
        error = 'В данный момент очеред пустая!'
    }

    if (error == 'DisTubeError [PAUSED]: The queue has been paused already'){
        error = 'Музыка и так находится на паузе!'
    }

    if (error == 'CustomError [Event]: Validation error'){
        error = 'Вы неправильно ввели данные!'
    }

    if (error == 'CustomError [Music]: Incorrect text chat'){
        error = 'Данную команду невозможно использовать в этом текстовом канале!'
    }

    if (error == 'CustomError [Music]: Not in voice channel'){
        error = 'Для использования вы должны находится в голосовом канале!'
    }

    if (error == 'CustomError [Moderator]: The user is not on the server'){
        error = 'Пользователь не находится на сервере!'
    }

    if (error == 'CustomError [Event]: Registration has already ended'){
        error = 'Вы не успели, регистрация уже закончилась!'
    }

    if (error == 'CustomError [Event]: And so not registered'){
        error = 'Вы и так не зарегистрированы!'
    }

    if (error == 'CustomError [Event]: And so already registered'){
        error = 'Вы и так уже зарегистрированы!'
    }

    if (error == 'CustomError [Event]: Exceeded the limit of participants'){
        error = 'Превышен лимит участников!'
    }

    if (error == 'CustomError [Interaction]: Too frequent use'){
        error = 'Не флудите!'
    }

    if (error == 'CustomError [Permission]: Missing permission'){
        error = 'Недостаточно прав для использование!'
    }

    if (error == 'CustomError [System]: Disabled function'){
        error = 'Времено не работает, приносим извинение!'
    }

    if (error == 'Error [ChannelNotCached]: Could not find the channel where this message came from in the cache!'){
        error = 'Не удалось определить сообщение!'
    }

    if(interaction.type == 2){
        console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.commandName} | STATUS: FAIL! | CODE: ${SysError}`)
    }

    if(interaction.type == 3){
        console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.customId} | STATUS: FAIL! | CODE: ${SysError}`)
    }


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
        ], ephemeral: true })

}


// ====================== HELP ==============================

module.exports.help = {
    name : 'error_handling',
    help : 'Обработка ошибок, и выведение их пользователю'
}