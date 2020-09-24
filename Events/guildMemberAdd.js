module.exports = (e, data) => {
    if(e.guild.id !== '612742745064472588') return;

    const embed = new Discord.RichEmbed();
    const user = e.user;

    if(!user.bot) {
        embed.setAuthor(`Welcome, ${user.username}#${user.discriminator} to Programming Club!`, 'https://i.ibb.co/9hKFZvj/Programming-Coding-Icon-300x300.png');
        embed.setDescription(`${e} This server is for anyone currently in Programming Club to discuss meetings, club projects, other things regarding the club, and other programming-related matters not tied to the club.`);
        embed.addField('Language Roles', 'In this server, we have a set of language roles which let us know what programming languages you know. If you know any programming languages, please follow the instructions listed in <#613190464186744894> under the "Language Roles" heading. If you do not know any, feel free to disregard this step.');
        embed.addField('More Information', 'We ask that you set your nickname to what you would go by in real life. You can see information about the server, channels, etc. in <#613190464186744894>. If you have a question after reading that, feel free to ask in <#758006082210627585>. 😄');
    } else {
        embed.setDescription(`[Bot] ${e} has been added to the server!`);
    }

    embed.setTimestamp();
    embed.setColor(0xF55142);

    e.guild.channels.get('613190640678993945').send({embed});
};