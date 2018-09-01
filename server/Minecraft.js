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

  addServer: function (name, host) {
    server = new Server(name, host);
    this.servers.set(name, server);
    this.retrieveStatus(server);
  },

  syncServer: function (server) {
    if (!server) return null;

    if ('pack' in server)
      this.servers.get(server.name)['pack'] = server.pack;

    if ('packversion' in server)
      this.servers.get(server.name)['packversion'] = server.packversion;
  },

  setServerProp: function (server, key, value) {
    this.servers.get(server)[key] = value;
  },

  retrieveStatus: function (server) {
    Gamedig.query({
      type: 'minecraftping',
      host: server.host
    }).then((state) => {
      server.status = 'Online';
      if (state.players.length > 0) {
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

  retrieveStatusEmbed: function () {
    return new Promise(resolve => {
      gamePromises = [];

      this.servers.forEach(server => {
        gamePromises.push(Gamedig.query({
          type: 'minecraftping',
          host: server.host
        }));
      });

      Promise.all(gamePromises).then(values => {
        const embed = new Discord.RichEmbed().setColor('#0099ff');
        this.servers.forEach((server, index) => {
          index = Array.from(this.servers.keys()).indexOf(index);
          if (values[index]) {
            state = values[index];
            server.status = 'Online';
            if (state.players.length > 0) {
              players = [];
              state.players.forEach(p => {
                players.push(p.name);
              });
              server.players = players;
            } else {
              server.players = [];
            }
            server.maxplayers = state.maxplayers;
            server.description = state.raw.description;
            server.minecraftVersion = state.raw.version;
          } else {
            server.status = 'Offline';
            server.players = '';
          }
          if (server.status === 'Online') {
            if (server.players.length > 0) {
              embed.addField(':arrow_up:' + server.name, (server.pack && server.packversion ? (server.pack + ' ' + server.packversion + '\n') : '') + _.map(server.players).join(', ') + ' [' + server.players.length + '/' + server.maxplayers + ']');
            } else {
              embed.addField(':arrow_up:' + server.name, (server.pack && server.packversion ? (server.pack + ' ' + server.packversion + '\n') : '') + 'No players online [' + server.players.length + '/' + server.maxplayers + ']');
            }
          } else {
            embed.addField(':arrow_down:' + server.name, '_Offline_');
          }
        });
        resolve(embed);
      });
    });
  },

  getStatusEmbed: function () {
    const embed = new Discord.RichEmbed().setColor('#0099ff');

    thiserver.servers.forEach(s => {
      if (s.status === 'Online') {

        if (s.players.length > 0) {
          embed.addField(':arrow_up:' + s.name, (s.pack && s.packversion ? (s.pack + ' ' + s.packversion + '\n') : '') + _.map(s.players).join(', ') + ' [' + s.players.length + '/' + s.maxplayers + ']');
        } else {
          embed.addField(':arrow_up:' + s.name, (s.pack && s.packversion ? (s.pack + ' ' + s.packversion + '\n') : '') + 'No players online [' + s.players.length + '/' + s.maxplayers + ']');
        }
      } else {
        embed.addField(':arrow_down:' + s.name, '_Offline_');
      }
    });

    return embed;
  },

  setupInterval: function () {
    setInterval(() => this.retrieveAll(), 60000);
  }

};

module.exports = Minecraft;