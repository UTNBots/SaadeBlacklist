const {Client, Events, GatewayIntentBits} = require('discord.js');
const {token} = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers]});

client.once(Events.ClientReady, c => {
    console.log("Bot is opgestart");
});

client.on("guildMemberAdd", member => {
    console.log(member)
})

client.login(token);