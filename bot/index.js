const discord = require('discord.js');
const {Client, Intents} = require('discord.js');

// Intents of Discord Bot
client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES']
});

// Create a Bot Prefix
const prefix = '?';

// Create a Discord Collection of Command Files
const fs = require('fs');
client.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

// Logs on console that the bot has come online
client.once('ready', ()=> {
  console.log('IIHF Bot is online!');
});

// Return a Message when a prefix and command a used
client.on('message', message =>{
  
  if(!message.content.startsWith(prefix) || message.author.bot)
      return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if(command === 'schedule') {
    client.commands.get('schedule').execute(message, args);
  }

});

// Bot Token
const token = "";
client.login(token);
