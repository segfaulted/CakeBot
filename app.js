const Discord = require('discord.js');
const Gamedig = require('gamedig');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//client.login('NDg0MDI1MjUwMjg0MzA2NDQz.Dmb_rw.KlF9ecXe22YY7iE8qXWhag18br4');

Gamedig.query({
	type: 'minecraftping',
  host: 'grits.breakfastcraft.com'
}).then((state) => {
	console.log(state);
}).catch((error) => {
  console.log("Server is offline");
  console.log(error);
});