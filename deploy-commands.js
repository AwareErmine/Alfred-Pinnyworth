const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

require("dotenv").config();
const testing = process.env.TESTING;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.CLIENT_TOKEN;

const commands = [];
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

// Register commands for test guild
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log("Successfully registered guild commands."))
    .catch(console.error);

// Register commands globally
if (!testing) {
  rest.put(Routes.applicationCommands(clientId), { body: commands })
      .then(() => console.log("Successfully registered commands globally."))
      .catch(console.error);
}
