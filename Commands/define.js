module.exports.run = (e, args) => {
  let arg = Functions.joinArgs(args);
  let key = config.dictionary_token;
  let restrictedRexExp = /\&|\?|\=|\/|\\|:|"|<|>|\||\./;
  let hasDisallowedChar = restrictedRexExp.test(arg);
  let api_url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${arg}?key=${key}`;

  if(args.length < 1) return '🇽 You must supply a word to define';
  if(hasDisallowedChar) return '🇽 This word has a blocked character. :(\n   | Inputs to this command cannot contain `&, ?, =, /, \\, :, ", <, >, |, or .`'
  Functions.fetchAPI(api_url).then(fetched => {
    let unfoundError = () => e.channel.send(`🇽 The word \`${arg}\` is not recognized.`);
    if(fetched.length < 1) return unfoundError();

    let maxDefinitions = index = 0;
    let isLocked = false;

    try {
      var names = fetched.return(def => def.meta.id.split(':')[0]);
    } catch(error) {
      return unfoundError();
    }

    names.forEach(name => {
      if(names[0] === name) maxDefinitions++;
    });

    let color = Functions.generateEmbedColor();
    let runGenerateEmbed = () => generateEmbed(fetched, index, arg, maxDefinitions, color, isLocked);
    let embed = runGenerateEmbed();

    e.channel.send(embed).then(message => {
      if(maxDefinitions === 1) return;

      message.react('◀').then(() => message.react('▶').then(() => {
        let onReactionUpdate = (reaction, user) => {
          if(user.id !== e.author.id) return;
          if(reaction.message.id !== message.id) return;

          switch(reaction.emoji.name) {
          case '◀':
            if(index === 0) index = maxDefinitions - 1;
            else index--;

            message.edit(runGenerateEmbed());
            break;
          case '▶':
            if(index + 1 === maxDefinitions) index = 0;
            else index++;
            
            message.edit(runGenerateEmbed());
            break;
          }
        };

        Client.on('messageReactionAdd', onReactionUpdate);
        Client.on('messageReactionRemove', onReactionUpdate);

        setTimeout(() => {
          message.reactions.forEach(reaction => {
            if(reaction.emoji.name !== '◀' && reaction.emoji.name !== '▶') return;

            if(e.guild.me.hasPermission('MANAGE_MESSAGES')) {
              reaction.users.forEach(user => {
                reaction.remove(user).catch(console.error);
              });
            }else {
              reaction.remove().catch(console.error);
            }
          });

          Client.removeListener('messageReactionAdd', onReactionUpdate);
          Client.removeListener('messageReactionRemove', onReactionUpdate);

          isLocked = true;
          message.edit(runGenerateEmbed());
        }, preload_data.embed.timer_duration);
      }));
    });
  });
};

function generateEmbed(fetched, index, arg, maxDefinitions, color, isLocked) {
  let data = fetched[index];
  if(data.shortdef.length < 1) return `🇽 Cannot parse definition of \`${arg}\`.`;

  let embedTitle = data.meta.id.toProperCase();
  if(data.date) embedTitle += ` (${data.date.split('{')[0]})`;

  let definition = new String();
  let defNumber = 0;
  data.shortdef.forEach(def => {
    defNumber++;
    definition += `${defNumber}. ${def}\n`;
  });

  let embed = new Discord.RichEmbed();
  embed.setAuthor(`\\📙 Define`);
  embed.setTitle(embedTitle);
  embed.setDescription(`${data.meta.offensive ? '[Offensive] ' : new String()}(${data.fl.toProperCase()})${isLocked ? ' [Locked]' : new String()}`);
  embed.addField('Definition', definition);
  embed.setFooter(`Defintion ${index + 1}/${maxDefinitions}\n${preload_data.embed.default_footer}`);
  embed.setColor(color);

  return {embed};
}