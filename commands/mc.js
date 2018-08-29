const { inspect } = require("util");

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

    // setProp is an enmap feature, it defines a single property of an object in an enmap key/value pair.
    serverVals = {
      name: server,
      host: var1,
      lastseen: { player: '', timestamp: 0 }
    };

    client.servers.set(server, serverVals);

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
      client.servers.setProp(server, var1, var2);

      // Confirm everything is fine!
      message.reply(`Successfully edited ${var1} to ${var2}`);
   } else

   if (action === "view") {
     // User must specify a key.
     if (!server) return message.reply("Please specify a name to view");

     server = client.servers.get(server);
    
     if (!server) return message.reply(`Server ${server} is not defined`);

     message.reply(`Server: ${inspect(server.host)}`);
   } else 

   if (action === "list") {
    let msg = '';
    console.log(client.servers);
    if (client.servers.size > 0) {
      client.servers.forEach(s => {
        msg += s.name + ' - ' + s.host + '\n';
      });

      message.reply(`The following servers exist:\n${msg}`);
    } else {
      message.reply(`No servers are defined`);
    }
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
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: "mc",
  category: "System",
  description: "View or change settings for a minecraft server.",
  usage: "mc <view/get/edit> <server> <key> <value>"
}
