module.exports.run = (e, args) => {
  const embed = new Discord.RichEmbed();
  const input = Functions.joinArgs(args, 0);
  let color;

  embed.setTitle('\📐 Calculate');
  embed.addField('Input', input);

  try {
    let output = mathjs.evaluate(input).toString();
    color = Functions.generateEmbedColor();

    embed.addField('Output', output);
    embed.setColor(color);
  } catch(err) {
    color = preload_data.colors.RED;
    embed.setColor(color);
    embed.addField('Output', 'Syntax Error');
  }

  return {embed};
};