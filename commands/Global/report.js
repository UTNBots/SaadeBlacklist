const {SlashCommandBuilder, PermissionFlagsBits,EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report een Saade member")
    .addStringOption(option =>
        option.setName("discordid")
        .setDescription("Discord ID van de Saade member")
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName("reden")
        .setDescription("Reden van de report")
        .setRequired(true)
    ),

    async execute(interaction,bot) {
        var discordId = interaction.options.getString("discordid");
        var reden = interaction.options.getString("reden");
        var guild = bot.guilds.cache.get('629454545759502376')
        var channel = guild.channels.cache.get('1344003128986701835')
        const embed = new EmbedBuilder()
        .setTitle("nieuwe report")
        .setDescription(`ID: ${discordId}
            Reden: ${reden}`)
        channel.send({embeds:[embed]})
        interaction.reply("Report is verzonden deze wordt zo snel als mogelijk verwerkt. Alvast bedankt voor de melding!")
    }
}