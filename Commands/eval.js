module.exports.run = (e, args) => {
    let input = Functions.joinArgs(args);

    let embed = new Discord.RichEmbed();
    let color = Functions.generateEmbedColor();

    embed.setTitle(`🖥️ Eval`);
    embed.addField('Input', input);
    embed.addField('Output', eval(input));
    embed.setFooter(preload_data.embed.default_footer);
    embed.setColor(color);

    return {embed};
};