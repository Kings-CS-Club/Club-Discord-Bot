const { e } = require("mathjs");

module.exports.run = (e, args) => {
    const arg = Functions.joinArgs(args).toLowerCase();
    const langs = preload_data.prgm_langs.return(l => l.toLowerCase());
    const langExists = langs.includes(arg);

    let lang;

    if(langExists) {
        lang = arg;
        addRole(lang, e.member, e.channel);
    } else {
        const match = similarity.findBestMatch(arg, langs);
        const bestMatch = match.bestMatch.target;
        const accuracy = match.bestMatch.rating;
        const casedMatch = preload_data.prgm_langs[langs.indexOf(bestMatch)];

        e.channel.send(`Language not found. Did you mean: **${casedMatch}**?`).then(msg => {
            msg.react('✅');
            msg.react('❌');

            let removeListener = () => {
                msg.reactions.forEach(reaction => {
                    if(reaction.emoji.name !== '✅' && reaction.emoji.name !== '❌') return;
      
                    if(e.guild.me.hasPermission('MANAGE_MESSAGES')) {
                        reaction.users.forEach(user => {
                            reaction.remove(user).catch(console.error);
                        });
                    } else {
                        reaction.remove().catch(console.error);
                    }
                });
      
                Client.removeListener('messageReactionAdd', onReact);
            };

            let onReact = (reaction, user) => {
                if(user.id !== e.author.id) return;
                if(reaction.message.id !== msg.id) return;

                switch(reaction.emoji.name) {
                case '✅':
                    lang = bestMatch;
                    addRole(lang, e.member, e.channel);
                    removeListener();
                    break;
                case '❌':
                    msg.edit('🇽 Try doing `?languages` to make sure that we have a role for your language and that you are typing it in exactly how it is written. If your language is not on the list, contact `Cabine#1558` or `Chief Designer#0382` and they will create it for you.');
                    removeListener();
                    break;
                default:
                    reaction.remove();
                }
            };

            Client.on('messageReactionAdd', onReact);

            setTimeout(() => {
                removeListener();
                msg.edit('Language not found.');
            }, preload_data.embed.timer_duration);
        });
    }
};

function addRole(role, member, channel) {
    const roleObj = channel.guild.roles.filter(r => r.name.toLowerCase() == role.toLowerCase()).first();

    if(member.roles.has(roleObj.id)) {
        return channel.send('🇽 You already have this role.');
    }

    member.addRole(roleObj);
    channel.send(`Role \`${roleObj.name}\` has been added to member \`${member.user.username}#${member.user.discriminator}\``);
}