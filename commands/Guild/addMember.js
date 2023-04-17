const {SlashCommandBuilder} = require('discord.js')
const mysql = require('mysql2')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmember')
        .setDescription('Add een member aan de database'),
    async execute(interaction) {
        await interaction.reply("x")
    }
}