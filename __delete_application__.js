const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
require('dotenv').config()
const rest = new REST({ version: '9' }).setToken(process.env.SECRET_TOKEN_DISCORD);

// ...

// for guild-based commands
rest.put(Routes.applicationGuildCommands('960267917088411679', config.id_server_main), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands('960267917088411679'), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);