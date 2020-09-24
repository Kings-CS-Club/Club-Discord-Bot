module.exports = (e, data) => {
    if(typeof data == 'undefined') return;
    console.log(data);

    if(e.author.equals(Client.user)) return;
    if(!e.content.startsWith(config.prefix)) return;
    if(!e.guild.me.hasPermission('SEND_MESSAGES')) {
      return e.auther.send('I cannot be used in that channel.').catch(console.error);
    }

    let msg = e.content;
    let msgData = msg.replace(config.prefix, new String());
    let cmd = msgData.split(config.seperator)[0];
    let argsUnfiltered = msgData
      .replace(cmd, new String())
      .replace(config.seperator, new String())
      .split(config.seperator);
    cmd = cmd.toLowerCase();

    let args = new Array();
    argsUnfiltered.forEach(arg => {
      if(!arg) return;
      args.push(arg);
    });

    if(data.cmds.indexOf(cmd) === -1) {
      return console.log(`[${Date.now()}] CMD: [${cmd.toUpperCase()}] NOT FOUND (in ${e.guild.id})`);
    } else console.log(`[${Date.now()}] CMD: [${cmd.toUpperCase()}] called in [${e.guild.name}: #${e.channel.name}] by ${e.author.username
                       }#${e.author.discriminator} with args of [${Functions.joinArgs(args)}]`);

    let res = require(`../Commands/${cmd}`).run(e, args);
    if(typeof res !== 'undefined') e.channel.send(res).catch(console.error);
};