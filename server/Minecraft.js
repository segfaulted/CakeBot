const _ = require('lodash');
const Gamedig = require('gamedig');
const Discord = require('discord.js');

class Server {
  constructor(name, host) {
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
}

var Minecraft = {
  servers: new Map(),

  addServer: function(name, host){
    server = new Server(name, host);
    this.servers.set(name, server);
    this.retrieveStatus(server);
	},

  syncServer: function(server){
    if(!server) return null;

    if('pack' in server)
      this.servers.get(server.name)['pack'] = server.pack;

    if('packversion' in server)
      this.servers.get(server.name)['packversion'] = server.packversion;
	},

  setServerProp: function (server, key, value) {
    this.servers.get(server)[key] = value;
  },

	retrieveStatus: function(server) {
    Gamedig.query({
      type: 'minecraftping',
      host: server.host
    }).then((state) => {
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
    this.servers.forEach(s => {
      if(s.status === 'Online') {
        
        if(s.players.length > 0) {
          embed.addField(':arrow_up:' + s.name,(s.pack && s.packversion  ? (s.pack + ' ' + s.packversion + '\n') : '') + _.map(s.players).join(', ') + ' [' + s.players.length + '/' + s.maxplayers + ']');
        } else {
          embed.addField(':arrow_up:' + s.name,(s.pack && s.packversion  ? (s.pack + ' ' + s.packversion + '\n') : '') + 'No players online [' + s.players.length + '/' + s.maxplayers + ']');
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

