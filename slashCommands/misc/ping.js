const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Replies with the latency of the bot",
    async execute(client, interaction) {
        const msgEmbed1 = new MessageEmbed()
        .setColor("F9A602")
        .setTitle("Tavern Bartender Ping")
        .setDescription(`Checking for bot ping...`)
        .setTimestamp()

        interaction.reply({ embeds: [msgEmbed1] })
        const message = await interaction.fetchReply();
        const timestamp = message.createdTimestamp;
        const latency = timestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping)

        const msgEmbed = new MessageEmbed()
        .setColor("F9A602")
        .setTitle("Tavern Bartender Ping")
        .setDescription(`🏓 pong`)
        .addFields({
            name: 'Latency',
            value: `${latency} ms`
        }, )
        .addField('Api Latency', `${apiLatency} ms`)
        .setTimestamp()
        .setFooter(`${latency} ms`)

        interaction.editReply({ embeds: [msgEmbed]})
    }
}