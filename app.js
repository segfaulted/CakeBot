const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config/config.json");
const Minecraft = require('./server/Minecraft');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.token);

client.on('message', message => {
  if (message.content.startsWith(config.prefix + "s") ) {
    embed = Minecraft.showStatus();
    message.channel.send(embed);
  }
  if (message.content.startsWith(config.prefix + "set")) {
    embed = Minecraft.showStatus();
    message.channel.send(embed);
  }
});

Minecraft.init();
Minecraft.getAll();
//Minecraft.setupInterval();
