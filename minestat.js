
const NUM_FIELDS = 6;   // number of values expected from server
address = null;
port = null;
online = null;          // online or offline?
version = null;         // server version
motd = null;            // message of the day
current_players = null; // current number of players online
max_players = null;     // maximum player capacity

module.exports =
{
  init: function(address, port, callback)
  {
    this.address = address;
    this.port = port;

    const net = require('net');
    const client = net.connect(port, address, () =>
    {
      var buff = new Buffer([ 0xFE, 0x01 ]);
      client.write(buff);
    });

    // Set timeout to 5 seconds
    client.setTimeout(5000);

    client.on('data', (data) =>
    {
      if(data != null && data != '')
      {
        var server_info = data.toString().split("\x00\x00\x00");
        console.log(server_info);
        if(server_info != null && server_info.length >= NUM_FIELDS)
        {
          this.online = true;
          this.version = server_info[2].replace(/\u0000/g,'');
          this.motd = server_info[3].replace(/\u0000/g,'');
          this.current_players = server_info[4].replace(/\u0000/g,'');
          this.max_players = server_info[5].replace(/\u0000/g,'');
        }
        else
        {
          this.online = false;
        }
      }
      callback();
      client.end();
    });

    client.on('timeout', () =>
    {
      callback();
      client.end();
      process.exit();
    });

    client.on('end', () =>
    {
      // nothing needed here
    });

    client.on('error', (err) =>
    {
      callback();
    });
  }
};