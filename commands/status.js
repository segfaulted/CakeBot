const { inspect } = require("util");
const _ = require('lodash');
const Gamedig = require('gamedig');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const servers = client.servers;
    
  const embed = client.minecraft.getStatusEmbed();

  message.reply(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['s'],
  permLevel: "User"
};

exports.help = {
  name: "status",
  category: "Minecraft",
  description: "View Breakfastcraft server status.",
  usage: "status"
}
