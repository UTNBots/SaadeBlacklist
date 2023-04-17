const {Client, Collection, Events, GatewayIntentBits} = require('discord.js');
const {token,DBHost,DBUser,DBPassword,DBDatabase} = require('./config.json');
const mysql = require('mysql2');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers]});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] De command op locatie ${filePath} mist de nodige data of execute waarden`)
    }
}

client.once(Events.ClientReady, c => {
    console.log("Bot is opgestart");
});

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
        await command.execute(interaction);
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