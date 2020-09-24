module.exports.run = (e, args) => {
  let key = config.lang_token;
  let arg = Functions.joinArgs(args, 1);
  let text = encodeURIComponent(arg);
  let word1 = args[0].toLowerCase();
  let langs = preload_data.translate_langs;
  let language = langs[word1] || Object.values(langs).find(lang => lang === word1);

  if(!language) return '🇽 This language name/code is invalid, formatted incorrect, or not supported. :(';
  let lang = Object.keys(langs).find(langCode => langs[langCode] === language);

  let api_url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${text}&lang=${lang}`;
  
  let messageError = (err = '🇽 An error has occurred :(') => e.channel.send(err).catch(console.error);
  let sentError = error => {
    messageError();
    console.error(error);
  };

  Functions.fetchAPI(api_url).then(fetched => {
    if(fetched.code !== 200) {
      console.log(`An error has been thrown: [Invalid Status Code: ${fetched.code}]`);
      return messageError();
    }

    let translation = fetched.text[0];
    if(translation.length <= 1024 && arg.length <= 1024) {
      let embed = new Discord.RichEmbed();
      let color = Functions.generateEmbedColor();

      embed.setTitle(`🈵 Translate (${fetched.lang})`);
      embed.addField('Input', arg);
      embed.addField('Output', translation);
      embed.setFooter(preload_data.embed.default_footer);
      embed.setColor(color);

      e.channel.send({embed}).catch(console.error);
    }else if(translation.length <= 1997) {
      e.channel.send(`🈵 ${translation}`).catch(console.error);
    }else if(translation.length <= 2000) {
      e.channel.send(translation).catch(console.error);
    } else if(translation.length <= 3997) {
      let message1 = translation.substring(0, 1997);
      let message2 = translation.substring(1997);
      
      e.channel.send(message1).catch(sentError).then(() => e.channel.send(message2).catch(sentError));
    } else {
      messageError('🇽 Translation exceeds character limit of 3997 :(');
      console.log('An error has been thrown: [Translation exceeds character limit of 3997]');
    }
  }).catch(() => {
    messageError();
  });
};