const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const {DBHost,DBUser,DBPassword,DBDatabase} = require('../../config.json');
const mysql = require('mysql2');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("scan")
    .setDescription("Scan your server for known members")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction,bot) {
        await interaction.reply("Scan is started")
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
                return console.error('error ' + err.message)
            }
            con.query(`SELECT * FROM Members`, async (err,rows) => {
                if(rows.length == 0){
                    interaction.followUp("There are currently no known members")
                } else {
                    for (row in rows){
                        let member = interaction.guild.members.cache.get(row.DiscordID)
                            if(member){
                                try {
                                    interaction.guild.members.fetch(row.DiscordID).then((member) => {
                                        member.kick(`SaadeBlacklist kick: ${reden}`)
                                    })
                                    } catch (error){
                                        console.log(`Kon ${row.DiscordID} niet kicken in ${guild.name}`)
                                        console.log(error)
                                        interaction.reply(`Couldn't kick ${row.DiscordID}`)
                                    }
                            }
                    }
                    con.end(function(err){
                        if (err){
                            interaction.reply("Er ging iets fout bij het opslaan van de data")
                            console.log(`Error: ${err.message}`)
                        }
                    })
                    interaction.followUp("Scan is ready")
                }
            })
        })
    }
}