const Discord = require('discord.js');
const client = new Discord.Client();

const Minecraft = require('./server/Minecraft');

var ms = require('./minestat');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login('NDg0MDI1MjUwMjg0MzA2NDQz.Dmb_rw.KlF9ecXe22YY7iE8qXWhag18br4');

client.on('message', message => {
  if (message.content === '!s') {
    embed = Minecraft.showStatus();
    message.channel.send(embed);
  }
});

//Minecraft.init();
//Minecraft.getAll();
//Minecraft.setupInterval();

ms.init('158.69.121.227', 25566, function(result) {
  console.log(ms);
});
