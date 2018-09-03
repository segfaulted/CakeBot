const { inspect } = require("util");
const _ = require('lodash');
const Gamedig = require('gamedig');
const Discord = require('discord.js');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const embed = new Discord.RichEmbed().setColor('#0099ff');

  client.servers.forEach((s) => {
    if(s.lastseen.timestamp > 0) {
      embed.addField(s.name, 'Last player(s) seen: ' + s.lastseen.player + ' at ' + new Date(s.lastseen.timestamp).toDateString() + ' ' + new Date(s.lastseen.timestamp).toLocaleTimeString('nl') + ' (Servertime)');
    } else {
      embed.addField(s.name, 'No players have been seen playing');
    }
  });
  message.reply(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ls'],
  permLevel: "User"
};

exports.help = {
  name: "lastseen",
  category: "Minecraft",
  description: "View the last seen players on a server.",
  usage: "lastseen"
}
