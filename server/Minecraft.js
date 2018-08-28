const _ = require('lodash');
const Gamedig = require('gamedig');
const Discord = require('discord.js');

function Server(connection) {
	this.uuid = String(uuid());
	this.connection = connection;
}

function Server(name, host) {
  this.name = name;
  this.host = host;
  this.status = 'unknown';
  this.players = [];
  this.maxplayers = 0;
  this.description = '';
  this.minecraftVersion = '';
}

var Minecraft = {
  servers: [],

  init: function(){
    this.servers.push(new Server('Bacon', 'bacon.breakfastcraft.com'));
    this.servers.push(new Server('Bagel', 'bagel.breakfastcraft.com'));
    this.servers.push(new Server('Donut', 'donut.breakfastcraft.com'));
    this.servers.push(new Server('Crepe', 'crepe.breakfastcraft.com'));
    this.servers.push(new Server('Brunch', 'brunch.breakfastcraft.com'));
    this.servers.push(new Server('Grits', 'grits.breakfastcraft.com'));
	},

	getStatus: function(server){
    Gamedig.query({
      type: 'minecraftping',
      host: server.host
    }).then((state) => {
      //console.log(state);
      server.status = 'Online';
      if(state.players.length > 0) {
        players = [];
        state.players.forEach(p => {
          players.push(p.name);
        });
        server.players = players;
      }
      server.maxplayers = state.maxplayers;
      server.description = state.raw.description;
      server.minecraftVersion = state.raw.version;
    }).catch((error) => {
      server.status = 'Offline';
      server.players = '';
    });
	},

	getAll: function(){
    this.servers.forEach(s => {
      this.getStatus(s);
    });
	},
  
	showStatus: function(){

    const embed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle('Server status');

    this.servers.forEach(s => {
      console.log(s);
      if(s.status === 'Online') {
        if(s.players.length > 0) {
          embed.addField('**' + s.name + '**' + ' _' + s.description + '_', 'Players online: ' + _.map(s.players).join(', ') + ' [' + s.players.length + '/' + s.maxplayers  +']' );   
        } else {
          embed.addField('**' + s.name + '**' + ' _' + s.description + '_', 'No players online [' + s.players.length + '/' + s.maxplayers  +']' );
        }
      } else {
        embed.addField('_' + s.name + '_', '_Offline_');
      }
      
    });

    return embed;
	},

	setupInterval: function(){
    setInterval(() => this.getAll(), 60000);
	}

};

module.exports = Minecraft;

