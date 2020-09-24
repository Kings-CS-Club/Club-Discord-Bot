module.exports.run = (e, args) => {
  let arg = Functions.joinArgs(args);
  let embed = new Discord.RichEmbed();
  let output = arg.reverse();
  let color = Functions.generateEmbedColor();

  if(arg.length <= 1024) {
    embed.setTitle(`🔃 Reverse`);
    embed.addField('Input', arg);
    embed.addField('Output', output);
    embed.setFooter(preload_data.embed.default_footer);
    embed.setColor(color);

    return {embed};
  } else {
    return `🔃 ${output}`;
  }
};