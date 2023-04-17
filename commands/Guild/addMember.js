const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const {DBHost,DBUser,DBPassword,DBDatabase} = require('../../config.json');
const mysql = require('mysql2');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmember')
        .setDescription('Add een member aan de database')
        .addStringOption(option => 
            option.setName("discordid")
            .setDescription("DiscordId van de gebruiker")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("reden")
            .setDescription("Reden van de blacklist")
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction,bot) {
        var discordId = interaction.options.getString("discordid");
        var reden = interaction.options.getString("reden");
        var con = mysql.createConnection({
            connectionLimit: 10,
            host: DBHost,
            user: DBUser,
            password: DBPassword,
            database: DBDatabase,
            insecureAuth: true
        });
        con.connect(function(err) {
            if (err){
                return console.error('error ' + err.message);
            }
        con.query(`SELECT * FROM Members WHERE DiscordId = ${discordId}`, async (err,rows) => {
            if (err)  throw err;
            if(rows.length > 0){
                interaction.reply("Deze gebruiker is al opgenomen in de database")
                con.end(function(err){
                    if(err) throw err;
                })
            } else {
                con.query(`INSERT INTO Members (DiscordID,Reden) VALUES (${discordId},"${reden}")`,(err,rows) => {
                    if (err){
                        interaction.reply("Er ging iets fout bij het opslaan van de data")
                        console.log(`Error: ${err.message}`)
                    } else {
                        interaction.reply("De gebruiker is succesvol opgeslagen")
                        bot.guilds.cache.forEach(guild => {
                            let member = guild.members.cache.get(discordId)
                            if(member){
                                try {
                                guild.members.fetch(discordId).then((member) => {
                                    member.kick(`SaadeBlacklist kick: ${reden}`)
                                })
                                } catch (error){
                                    console.log(`Kon ${discordId} niet kicken in ${guild.name}`)
                                    console.log(error)
                                }
                            }
                        });
                    }
                    con.end(function(err){
                        if (err){
                            interaction.reply("Er ging iets fout bij het opslaan van de data")
                            console.log(`Error: ${err.message}`)
                        }
                    })
                })
            }
        })
        })
    }
}