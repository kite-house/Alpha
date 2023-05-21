const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction, db, config) => {
    if (interaction != 'System'){
        if(interaction.user.id != interaction.guild.OwnerID) return interaction.reply({
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
    }

    db.query('DELETE FROM users WHERE 1')
    db.query('ALTER TABLE users AUTO_INCREMENT = 1')
    guild = client.guilds.cache.get(config.id_server_main)
    let res = await guild.members.fetch();
    res.forEach((member) => {
        user = member.user
        let role = member.roles.cache.map(r => r).join(', ')
        role = role.replace(", @everyone", '')
        role = '['+ role +']'
        if (user.avatar == null){
            user.avatar = 'null'
        }

        if (member.nickname == null){
            member.nickname = user.username
        }

        let NewUser = [
            [user.id],
            [member.nickname],
            [user.username + '#' + user.discriminator],
            [user.avatar],
            [role]
        ]
    
        db.query(`INSERT INTO users(discord_id, nickname, username, avatar, role) VALUES (?)`, [NewUser], function(err, results) {
            if(err) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${member.nickname}, STATUS: ${err}!`)
            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${member.nickname}, STATUS: ACCEPT!`)
        });
    });

}

// ================== HELP ============================

module.exports.help = {
    name : 'database_update',
    description : 'Полное копирование всех участников дискорда, создание таблицы базы данных!',
    data: new SlashCommandBuilder()
    .setName("database_update")
    .setDescription("Полное копирование всех участников дискорда, создание таблицы базы данных!")
}