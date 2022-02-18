// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed, Collection } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

require("dotenv").config();
const testing = process.env.TESTING;
const token = testing ? process.env.TEST_CLIENT_TOKEN : process.env.CLIENT_TOKEN;

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});

client.application.commands.set([]);

const fs = require("fs");
client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once("ready", () => {
    console.log("Consider thyself ready");
});

// Get all commands and store them
const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, {
            client: client,
        });
    } catch (error) {
        console.log("u suck");
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

// Login to Discord with your client's token
client.login(token);
