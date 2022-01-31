const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions, GuildMember, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove the pins in a channel")
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('move')
        .setDescription("Move the pins before removing them")
  			.addChannelOption(option => option.setName('destination').setDescription('Select a channel').setRequired(true))
      )
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('no-move')
        .setDescription("Just get rid of the pins")
      ),

  async execute(interaction, props) {
    // Check if the user can things
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      await interaction.reply("This power is beyond thee. Begone, commoner!");
      return;
    }

    const row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("cancel").setLabel("Cancel").setStyle("DANGER"),
        new MessageButton().setCustomId("confirm").setLabel(`Remove pins ${interaction.options.getSubcommand() === "move" ? "and move them" : ""}`).setStyle("SUCCESS")
      );
    await interaction.reply({ content: "You sure?", components: [row], ephemeral: true }).then(() => {
        const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", time: 15000 });
        collector.on("collect", async (click) => {
          const replies = {
            cancel: "Cancelled!",
            confirm: `Removing ${interaction.options.getSubcommand() === "move" ? "and moving" : ""} pins...`,
          };
          const newReply = replies[click.customId];
          if (click.customId === "confirm") {
            if (interaction.options.getSubcommand() === "move") {
              const move = props.client.commands.get("move");
              move.execute(interaction, props);
            }

            const curr_channel = props.client.channels.cache.get(interaction.channelId); // channel command was sent from
            curr_channel.messages.fetchPinned().then((data) => {
              data.reverse().forEach((item, i) => {
                item.unpin(); // but I could pin you ahaha
              });
            });
          }
          await click.update({ content: newReply, components: [] });
        });
    })
  },
};
