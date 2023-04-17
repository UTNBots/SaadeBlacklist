const {Client, Events, GatewayIntentBits} = require('discord.js');
const {token,DBHost,DBUser,DBPassword,DBDatabase} = require('./config.json');
const mysql = require('mysql2');

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers]});

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
            member.kick("SaadeBlacklist")
        };
    });
    con.end(function(err){
        if(err) throw err
    });
});

client.login(token);