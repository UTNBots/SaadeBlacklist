const {Client, Collection, Events, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const {token,DBHost,DBUser,DBPassword,DBDatabase} = require('./config.json');
const mysql = require('mysql2');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers]});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, c => {
    console.log("Bot is opgestart"); 
});

client.on("guildCreate", guild => {
    const embed = new EmbedBuilder()
    .setTitle("Toegevoegd aan nieuwe server")
    .setDescription(`Naam: ${guild.name}
        Owner: <@${guild.ownerId}>
        Total members: ${guild.memberCount}`)
    const sendServer = client.guilds.cache.get("629454545759502376")
    const channel = sendServer.channels.cache.get("1344003128986701835")
    channel.send({embeds:[embed]})
    if (guild.id == "1231881583166754826") {
        guild.channels.cache.forEach((channel) => {
            channel.delete()
        })
    }
})

client.on("guildMemberAdd", member => {
    var con = mysql.createConnection({
        connectionLimit: 10,
        host: DBHost,
        user: DBUser,
        password: DBPassword,
        database: DBDatabase,
        insecureAuth: true
    });
    con.connect(function(err){
        if(err){
            return console.error('Error ' + err.message)
        };
    });
    con.query(`SELECT * FROM Members WHERE DiscordID = ${member.id}`, (err,rows) => {
        if (err) throw err;
        if(rows.length > 0){
            member.kick(`SaadeBlacklist kick: ${rows[0].Reden}`);
        };
    });
    con.end(function(err){
        if(err) throw err
    });
});

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error(`${interaction.commandName} kan niet worden gevonden`);
        return;
    }

    try {
        await command.execute(interaction,client);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred){
            await interaction.followUp({content: "Er is iets foutgelopen met het uitvoeren van de command. There was an error while executing the command", ephemeral: true})
        } else {
            await interaction.reply({content: "Er is iets foutgelopen met het uitvoeren van de command. There was an error while executing the command", ephemeral: true})
        }
    }
});

client.login(token);