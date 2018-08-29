const _ = require('lodash');
const Gamedig = require('gamedig');
const Discord = require('discord.js');

function Server(name, host) {
  this.name = name;
  this.host = host;
  this.status = 'unknown';
  this.players = [];
  this.maxplayers = 0;
  this.description = '';
  this.minecraftVersion = '';
  this.pack = '';
  this.packversion = '';
}

var Minecraft = {
  servers: [],

  addServer: function(name, host){
    this.servers.push({ [name]: new Server(name, host) });
	},

  setPack: function (name, host) {

  },

	retrieveStatus: function(server){
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

	retrieveAll: function(){
    this.servers.forEach(s => {
      this.retrieveStatus(s);
    });
	},
  
	getStatusEmbed: function(){
    const embed = new Discord.RichEmbed().setColor('#0099ff');
    console.log(this.servers);
    this.servers.forEach(s => {
      console.log(s.Bacon);
      if(s.status === 'Online') {
        if(s.players.length > 0) {
          embed.addField(':arrow_up:' + s.name, '' + s.description + '' + '\n' + _.map(s.players).join(', ') + ' [' + s.players.length + '/' + s.maxplayers + ']');
        } else {
          embed.addField(':arrow_up:' + s.name, '' + s.description + '' + '\n' + 'No players online [' + s.players.length + '/' + s.maxplayers + ']');
        }
      } else {
        embed.addField(':arrow_down:' + s.name, '_Offline_');
      }
      
    });

    return embed;
	},

	setupInterval: function(){
    setInterval(() => this.retrieveAll(), 60000);
	}

};

module.exports = Minecraft;

