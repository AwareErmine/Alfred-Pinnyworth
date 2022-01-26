const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("Move...ing in with ur mother!"),
    async execute(interaction, props) {
        const channel = props.client.channels.cache.get(interaction.channelId);
        const pins = channel.messages.fetchPinned().then((data) => {
            console.log(data);
            // Check if admin
            // Get & validate channel from arguments

            // If multiple channels, respond with middle finger emoji

            // Make the embed
            // Remove the pin
            // Send the embed
        });
        await interaction.reply("Pong!");
    },
};
