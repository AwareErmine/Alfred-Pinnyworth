const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pins-left")
        .setDescription("Counts the pins left in a channel"),
    async execute(interaction, props) {
        const curr_channel = props.client.channels.cache.get(interaction.channelId);
        curr_channel.messages.fetchPinned().then((data) => {
          var pin_count = [...data].length;
          const count_embed = {
            title: `${curr_channel.name} has ${pin_count} pin${pin_count > 1 ? "s" : ""}`,
            color: "#DD2E44",
            fields: [
              {
                name: `You have ${50 - pin_count} pin${50 - pin_count > 1 ? "s" : ""} left`,
                value: "📌".repeat(50 - pin_count),
                inline: false,
              }
            ],
            timestamp: new Date(),
          };
          interaction.reply({ embeds: [count_embed] });
        });
    },
};
