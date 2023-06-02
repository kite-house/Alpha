const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')


module.exports = (client, newUser, db, config) => {
    console.log(`MEMBER-INFO: USER: ${newUser.user.id} | INFO: JOINED | STATUS:`, 'ACCEPT!'.green)
    client.channels.cache.get(config.ds_member).send(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: newUser.user.avatarURL(newUser.user.avatar) , name: `${newUser.user.username}#${newUser.user.discriminator}`})
            .setThumbnail(newUser.user.avatarURL(newUser.user.avatar))
            .setTitle(`Пользователь присоединился к серверу!`)
            .setDescription(`Новый участник <@${newUser.id}>`)
            .setColor(Discord.Colors.Green)
            .setTimestamp()
        ]})

    client.channels.cache.get(config.new_members).send(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: newUser.user.avatarURL(newUser.user.avatar) , name: `${newUser.user.username}#${newUser.user.discriminator}`})
            .setThumbnail(newUser.user.avatarURL(newUser.user.avatar))
            .setTitle(`Новый пользователь!`)
            .setDescription(`${newUser} присоединился(-ась) к серверу!`)
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: `Всего пользователей: ${client.guilds.cache.get(newUser.guild.id).memberCount}`
            })
            .setColor(Discord.Colors.DarkAqua)
            .setTimestamp()
        ]})
    
    let roles = newUser.roles.cache.map(r => r).join(', ')
    roles = roles.replace(", @everyone", '')
    roles = '['+ roles +']'

    if (roles == '[@everyone]'){
        roles = 'None'
    }

    if (newUser.user.avatar == null){
        newUser.user.avatar = 'null'
    }

    if (newUser.nickname == null){
        newUser.nickname = newUser.user.username
    }

    let NewUser = [
        [newUser.user.id],
        [newUser.nickname],
        [newUser.user.username + '#' + newUser.user.discriminator],
        [newUser.user.avatar],
        [roles],
        [new Date(newUser.joinedTimestamp).toLocaleString().split(', ')[0]],
        ['']
    ]

    db.query(`INSERT INTO users(discord_id, username, nickname, avatar, roles, joined, access) VALUES (?)`, [NewUser], function(error, results) {
        if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${newUser.nickname}, STATUS: ${error}`);
        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${newUser.nickname}, STATUS: ACCEPT!`)
    })

}

module.exports.help = {
    name : 'guildMemberAdd',
    description: 'Обработка нового юзера'
}

