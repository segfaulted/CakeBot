const {
  inspect
} = require("util");

exports.run = async (client, message, [action, server, var1, ...var2], level) => { // eslint-disable-line no-unused-vars

  const servers = client.servers;

  // Edit an existing key value
  if (action === "add") {
    // User must specify a key.
    if (!server) return message.reply("Please specify a name to add");
    // User must specify a server.
    if (!var1) return message.reply("Please specify a hostname for the new server");
    // User must specify a server that actually exists!
    if (servers[server]) return message.reply("This server already exists");

    serverVars = {
      name: server,
      host: var1,
      lastseen: {
        player: '',
        timestamp: 0
      }
    };

    client.servers.set(server, serverVars);
    client.minecraft.addServer(server, var1);
    // Confirm everything is fine!
    message.reply(`Successfully added server ${server}`);
  } else

  if (action === "set") {
    // User must specify a server.
    if (!server) return message.reply("Please specify a servername to edit");
    // User must specify a key.
    if (!var1) return message.reply("Please specify a value to edit");
    // User must specify a value to change.
    if (var2.length < 1) return message.reply("Please specify a new value");
    if (!client.servers.has(server)) return message.reply("Please specify an existing server to edit");

    // setProp is an enmap feature, it defines a single property of an object in an enmap key/value pair.
    client.servers.setProp(server, var1, var2.join(' '));
    client.minecraft.setServerProp(server, var1, var2.join(' '));
    // Confirm everything is fine!
    message.reply(`Successfully edited ${var1} to ${var2.join(' ')}`);
  } else

  if (action === "view") {
    // User must specify a key.
    if (!server) return message.reply("Please specify a name to view");

    server = client.servers.get(server);

    if (!server) return message.reply(`Server ${server} is not defined`);

    message.channel.send(`${inspect(server)}`, {
      code: "json"
    });
  } else

  if (action === "list") {
    let msg = '';
    if (client.servers.size > 0) {
      client.servers.forEach(s => {
        msg += s.name + ' - ' + s.host + ' ' + (s.pack ? '[ ' + s.pack + ' ]' : '') + ' ' + (s.packversion ? s.packversion : '') + '\n';
      });

      message.channel.send(msg, {
        code: "json"
      });
    } else {
      message.reply(`No servers are defined`);
    }
  } else

  if (action === "usage") {
    let msg = '';
    if (server === 'add') {
      msg = '=Usage of !mc add\n';
      msg += '::The add command has the following parameters:\n';
      msg += '  !mc add <SERVERNAME> <SERVERHOST>\n';
      msg += '\n';
      msg += '  <SERVERNAME> is the \'friendly\' display name\n';
      msg += '  <SERVERHOST> is the ip adress or hostname of the server\n';
    } else 
    if (server === 'remove') {
      msg = '=Usage of !mc remove\n';
      msg += '::The remove command has the following parameters:\n';
      msg += '  !mc remove <SERVERNAME>\n';
      msg += '\n';
      msg += '  <SERVERNAME> is the \'friendly\' display name\n';
      msg += '\n';
      msg += 'After the command has been given, reply with y or yes to confirm removal';
    } else 
    if (server === 'set') {
      msg = '=Usage of !mc set\n';
      msg += '::The set command has the following parameters:\n';
      msg += '  !mc set <SERVERNAME> <SERVERVARIABLE>\n';
      msg += '\n';
      msg += '  <SERVERNAME> is the \'friendly\' display name\n';
      msg += '  <SERVERVARIABLE> is one of the following options:\n';
      msg += '     name: Friendly name of the server (!reboot required)\n';
      msg += '     host: Server ip/host\n';
      msg += '     pack: Name of the pack\n';
      msg += '     packversion: Version of the pack\n';
      msg += '\n';
      msg += 'Note: If there are spaces in a value encapsulate in "';
      msg += '      A pack name and version are required if they are to be shown';
      
    } else {
      msg = '=Available commands for !mc\n';
      msg += '::Server admin commands:\n';
      msg += '  !mc < add / remove / list >\n';
      msg += '\n';
      msg += '::Server configuration commands:\n';
      msg += '  !mc < set / view > ';
      msg += '\n';
      msg += '::Type !mc usage <command> for more info:';
      msg += '\n';
    }


    message.channel.send(msg, {
      code: "asciidoc"
    });
  } else

    // Resets a key to the default value
    if (action === "remove") {
      if (!server) return message.reply("Please specify a server to remove.");

      // Good demonstration of the custom awaitReply method in `./modules/functions.js` !
      const response = await client.awaitReply(message, `Are you sure you want to remove ${server}?`);

      // If they respond with y or yes, continue.
      if (["y", "yes"].includes(response.toLowerCase())) {
        // We delete the `key` here.

        client.servers.delete(server);
        message.reply(`${server} was successfully removed.`);
      } else
        // If they respond with n or no, we inform them that the action has been cancelled.
        if (["n", "no", "cancel"].includes(response)) {
          message.reply("Action cancelled.");
        }
    } else {
      message.channel.send('Please add a');
    }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['sa'],
  permLevel: "Administrator"
};

exports.help = {
  name: "mc",
  category: "Minecraft",
  description: "View or change settings for a minecraft server.",
  usage: "Type < !mc usage > for detailed help with the !mc command"
}