const { inspect } = require("util");
const _ = require('lodash');
const Gamedig = require('gamedig');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  embed = await client.minecraft.retrieveStatusEmbed();
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
