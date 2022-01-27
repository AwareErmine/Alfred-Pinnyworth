const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions, GuildMember } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Move...ing in with ur mother!")
    .addChannelOption(option => option.setName('destination').setDescription('Select a channel')),

  async execute(interaction, props) {
    // Check if the user can things
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      await interaction.reply("This power is beyond thee. Begone, commoner!");
      return;
    }

    // Check they gave a channel with the commands thing
    const destination_channel = interaction.options.getChannel('destination');
    if (destination_channel === null) {
      await interaction.reply("Pick a channel to move the pins into, silly goose!");
      return;
    };

    const curr_channel = props.client.channels.cache.get(interaction.channelId); // channel command was sent from
    const pins = curr_channel.messages.fetchPinned().then((data) => {
      console.log(data);
      data.forEach((item, i) => {
        // I could... get embed with you ahaha
        let messageAttachment = item.attachments.size > 0 ? [...item.attachments][0].url : null; // Check for attachments?? (broken does not)
        const pinEmbed = {
          author: {
        	   name: item.author.username,
             icon_url: `https://cdn.discordapp.com/avatars/${item.author.id}/${item.author.avatar}`,
             url: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${item.id}`,
        	},
          description: item.content,
          timestamp: new Date(),
          image: {
            url: messageAttachment,
          },
          footer: {
        		text: 'Forever pinned in our hearts',
        		icon_url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/79/pushpin_1f4cc.png',
        	},
        };
        destination_channel.send({ embeds: [pinEmbed] });
        // TODO: Images don't show up in the embed so that is a thing
        // item.unpin(); // but I could pin you ahaha (commented out for testing)
      });
    });
    // TODO: Button to confirm the move (?)
    await interaction.reply(`Moving to ${destination_channel}`);
  },
};
