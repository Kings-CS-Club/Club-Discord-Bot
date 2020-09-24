module.exports.run = (e, args) => {
    const embed = new Discord.RichEmbed();
    const color = Functions.generateEmbedColor();

    embed.setTitle('💻 Languages');
    embed.setDescription(preload_data.prgm_langs.return(lang => `* ${lang}`).join('\n'));
    embed.setFooter(preload_data.embed.default_footer);
    embed.setColor(color);

    return {embed};
};