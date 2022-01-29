// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed, Collection } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const { testing } = require('./config.json');
const { token } = require(`./${testing ? "testing_" : ""}config.json`);

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const fs = require("fs");
client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once("ready", () => {
    console.log("Ready!");
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
