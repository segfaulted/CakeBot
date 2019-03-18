const { inspect } = require("util");
const _ = require('lodash');
const Gamedig = require('gamedig');
const Discord = require('discord.js');
const moment = require('moment');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const embed = new Discord.RichEmbed().setColor('#0099ff');

  client.servers.forEach((s) => {
    if(s.lastseen.timestamp > 0 && s.lastseen.player) {
      embed.addField(s.name, s.lastseen.player + ' ' + (s.lastseen.type ? s.lastseen.type : 'was') + ' last seen ' + moment(s.lastseen.timestamp).fromNow() + '.');
    } else {
      embed.addField(s.name, 'No players have been seen playing since ' + moment(s.lastseen.timestamp).fromNow() + '.');
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
