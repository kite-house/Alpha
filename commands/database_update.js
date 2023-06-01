const { SlashCommandBuilder} = require('discord.js');

module.exports = async (client, interaction, db, config, check_permision) => {
    if (interaction != 'System'){
        if(!check_permision(client, interaction, 'Developer')) return
    }

    db.query('DELETE FROM users WHERE 1')
    db.query('ALTER TABLE users AUTO_INCREMENT = 1')
    guild = client.guilds.cache.get(config.id_server_main)
    let res = await guild.members.fetch();
    res.forEach((member) => {
        user = member.user
        let roles = member.roles.cache.map(r => r).join(', ')
        roles = roles.replace(", @everyone", '')
        roles = '['+ roles +']'
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
            [roles],
            [new Date(member.joinedTimestamp).toLocaleString().split(', ')[0]],
            ['']
        ]
    
        db.query(`INSERT INTO users(discord_id, nickname, username, avatar, roles, joined, access) VALUES (?)`, [NewUser], function(error, results) {
            if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${member.nickname}, STATUS: ${error}!`)
            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: ${member.nickname}, STATUS: ACCEPT!`)
        });
    });

    if (interaction != 'System') console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.commandName} | STATUS:`, 'ACCEPT!'.green)
    if (interaction == 'System') console.log('SYSTEM-INFO: DATABASE UPDATE | STATUS:', 'ACCEPT!'.green)
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'database_update',
    description : 'Полное копирование всех участников дискорда, создание таблицы базы данных!',
    data: new SlashCommandBuilder()
    .setName("database_update")
    .setDescription("Полное копирование всех участников дискорда, создание таблицы базы данных!")
}