console.clear();
console.log('App Started. Lauching Bot...\n');

global.Discord = require('discord.js');
global.Client = new Discord.Client({fetchAllMembers: true});
global.fs = require('fs');
global.path = require('path');
global.request = require('request');
global.config = JSON.parse(fs.readFileSync('config.json'));
global.mathjs = require('mathjs');
global.similarity = require('string-similarity');

const iterateDir = require('./Functions/iterateDir');
global.Functions = new Object();

const removeExtension = (file, extension = 'js') => file.replace(`.${extension}`, new String());
getGlobals();

Client.once('ready', () => {
  const cmds = fs.readdirSync('Commands').return(item => item.replace('.js', new String()));
  const data = {cmds};

  iterateDir('Events', eventFile => {
    let event = removeExtension(eventFile);
    Client.on(event, e => require(`./Events/${event}`)(e, data));
  });

  iterateDir('Actions', action => {
    let name = removeExtension(action);

    console.log(`[${Date.now()}] Running Action: ${name}`);
    require(`./Actions/${name}`)().then(info => {
      console.log(` > [${Date.now()}] Action [${name}] Sucessful`);
      if(info) console.log(`   - Action Finished with Callback of: [${info}]`);
      console.log();
    }).catch(error => {
      console.log(` > [${Date.now()}] Action [${name}] Failed:\n`);
      if(info) console.error(error);
      console.log('\n\n');
    });
  });
});

function getGlobals() {
  iterateDir('Prototypes', type => {
    let typeDir = fs.readdirSync(`Prototypes/${type}`);
    typeDir.forEach(typeFile => {
      let t = removeExtension(typeFile);
      global[type].prototype[t] = require(`./Prototypes/${type}/${t}`);
    });
  });
  
  iterateDir('Functions', funcFile => {
    let func = removeExtension(funcFile);
    global.Functions[func] = require(`./Functions/${func}`);
  });
  
  let preload = new Object();
  iterateDir('Preload_Data', dataFileName => {
    let dataName = removeExtension(dataFileName, 'json');
    preload[dataName] = JSON.parse(fs.readFileSync(`Preload_Data/${dataFileName}`));
  });
  
  global.preload_data = preload;
}

Client.login(config.token).catch(console.error);