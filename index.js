const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, prefix } = require('./config.json');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

client.message_commands = new Collection();
const message_commandFiles = fs.readdirSync('./message_commands').filter(file => file.endsWith('.js'));

for (const file of message_commandFiles) {
    const message_command = require(`./message_commands/${file}`);
    client.message_commands.set(message_command.name, message_command);
}

client.once('ready', () => {
    console.log('Bag.o lang ko bugtaw');
})

client.on("messageCreate", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.message_commands.has(command)) return;

    try {
        client.message_commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("Dali lang gd bla pota");
    }
})

client.login(token);