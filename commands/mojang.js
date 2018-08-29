const { inspect } = require("util");
const _ = require('lodash');
const axios = require('axios');
const Discord = require('discord.js');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const response = await axios.get('https://status.mojang.com/check');

  status = response.data;

  const embed = new Discord.RichEmbed().setColor('#0099ff');

  console.log(status);
  let msg = '';

  if(status[0]['minecraft.net'] === 'green'){
    msg += ':white_check_mark: Minecraft.net\n';
  } else {
    msg += ':x: Minecraft.net\n';
  }

  if(status[1]['session.minecraft.net'] === 'green'){
    msg += ':white_check_mark: Multiplayer session service\n';
  } else {
    msg += ':x: Mojang accounts website\n';
  }

  if(status[2]['account.mojang.com'] === 'green'){
    msg += ':white_check_mark: Mojang accounts website\n';
  } else {
    msg += ':x: Multiplayer session service\n';
  }

  if(status[3]['authserver.mojang.com'] === 'green'){
    msg += ':white_check_mark: Authentication service\n';
  } else {
    msg += ':x: Authentication service\n';
  }
  
  embed.addField('Mojang server status', msg);
  
  message.reply(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "mojang",
  category: "Minecraft",
  description: "View Mojang server status.",
  usage: "status"
}
