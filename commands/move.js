const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions, GuildMember } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Move pins from one channel to another")
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
    curr_channel.messages.fetchPinned().then((data) => {
      data.reverse().forEach((item, i) => {
        // I could... get embed with you ahaha
        let message_attachment = item.attachments.size > 0 ? item.attachments.map(a => a.url)[0] : null; // Check for attachments?? (broken does not)
        // console.log(item.createdTimestamp);
        const pin_embed = {
          color: (item.member ? item.member.displayHexColor : null),
          author: {
        	   name: item.author.username,
             icon_url: `https://cdn.discordapp.com/avatars/${item.author.id}/${item.author.avatar}`,
             url: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${item.id}`,
        	},
          description: item.content,
          timestamp: new Date(item.createdTimestamp), // I could have a... new date with you
          image: {
            url: message_attachment,
          },
          footer: {
        		text: 'Forever pinned in our hearts',
        		icon_url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/79/pushpin_1f4cc.png',
        	},
        };
        destination_channel.send({ embeds: [pin_embed] });
        // item.unpin(); // but I could pin you ahaha
      });
    });
    await interaction.reply(`Moving to ${destination_channel}`);
  },
};
