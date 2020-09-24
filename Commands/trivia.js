const Trivia = require('trivia-api')
const trivia = new Trivia({encoding: 'url3986'});

module.exports.run = (e, args) => {
  trivia.getQuestions().then(questions => {
    if(questions.response_code !== 0) {
      e.channel.send('🇽 Cannot get trivia question.');
      throw new Error(`Error (${questions.response_code}): Cannot fetch trivia question.`);
    }

    let question = questions.results[0];
    let isTF = question.correct_answer === 'True' || question.correct_answer === 'False';
    let embed = new Discord.RichEmbed();

    embed.setColor(preload_data.colors.PURPLE);
    embed.setFooter(preload_data.embed.default_footer);
    embed.setTitle('\\🃏 Trivia');
    embed.addField('Category', question.category, true);
    embed.addField('Difficulty', question.difficulty.toProperCase(), true);
    
    if(isTF) {
      embed.addField('Type', 'True/False', true);
    } else {
      embed.addField('Type', 'Multiple Choice', true);
    }

    embed.addField('Question', decode(question.question));

    let answers = {
      '🇦': null,
      '🇧': null,
      '🇨': null,
      '🇩': null
    };

    let letters = {
      '🇦': 'A',
      '🇧': 'B',
      '🇨': 'C',
      '🇩': 'D'
    };

    let correctLetter = Object.keys(answers)[Math.floor(Math.random() * 4)];

    if(!isTF) {
      console.log(question.incorrect_answers);

      answers[correctLetter] = question.correct_answer;
      let inAnsInd = 0;

      for(let i in answers) {
        if(answers[i] !== null) continue;
        answers[i] = question.incorrect_answers[inAnsInd];
        inAnsInd++;
      }

      let ansStr = new String();
      for(let i in answers) {
        ansStr += `${letters[i]}. ${answers[i]}\n`;
      }

      embed.addField('Answer Choices', decode(ansStr));
    }

    e.channel.send({embed}).then(msg => {
      if(isTF) (async () => {
        await msg.react('🇹').catch(console.error);
        await msg.react('🇫').catch(console.error);
        addReactionListeners();
      })();
      else (async () => {
        await msg.react('🇦').catch(console.error);
        await msg.react('🇧').catch(console.error);
        await msg.react('🇨').catch(console.error);
        await msg.react('🇩').catch(console.error);
        addReactionListeners();
      })();

      setTimeout(() => {
        removeReactionListener();
        if(!msg.deletable) return;
        msg.delete().catch(console.error);
      }, preload_data.embed.timer_duration);

      function onReactionUpdate(reaction, user) {
        if(user.id !== e.author.id) return;
        if(reaction.message.id !== msg.id) return;

        let emoji = reaction.emoji.name;
        let isAnswer = Object.keys(answers).includes(emoji);

        if(!isTF) {
          if(isAnswer) {
            if(answers[emoji] === question.correct_answer) {
              embed.setColor(preload_data.colors.GREEN);
              embed.setTitle('\\🃏 Trivia         \\✅');
            } else {
              embed.setColor(preload_data.colors.RED);
              embed.addField('Said', decode(`${letters[emoji]}. ${answers[emoji]}`), true);
              embed.setTitle('\\🃏 Trivia         \\❌');
            }

            removeReactionListener();
            embed.addField('Answer', decode(`${letters[correctLetter]}. ${question.correct_answer}`), true);
            msg.edit({embed});
          }
        } else {
          let onCorrect = correct => {
            embed.setColor(preload_data.colors.GREEN);
            embed.setTitle('\\🃏 Trivia         \\✅');
            embed.addField('Answer', correct, true);
          };

          let onIncorrect = (said, correct) => {
            embed.setColor(preload_data.colors.RED);
            embed.addField('Said', said, true);
            embed.addField('Answer', correct, true);
            embed.setTitle('\\🃏 Trivia         \\❌');
          };

          if(emoji === '🇹') {
            if(question.correct_answer === 'True') onCorrect('True');
            else onIncorrect('True', 'False');

            msg.edit({embed});
            removeReactionListener();
          }

          if(emoji === '🇫') {
            if(question.correct_answer === 'False') onCorrect('False')
            else onIncorrect('False', 'True');

            msg.edit({embed});
            removeReactionListener();
          }
        }
      }

      function addReactionListeners() {
        Client.on('messageReactionAdd', onReactionUpdate);
        Client.on('messageReactionRemove', onReactionUpdate);
      }

      function removeReactionListener() {
        Client.removeListener('messageReactionAdd', onReactionUpdate);
        Client.removeListener('messageReactionRemove', onReactionUpdate);

        msg.reactions.forEach(reaction => {
          if(!['🇹', '🇫', '🇦', '🇧', '🇨', '🇩'].includes(reaction.emoji.name)) return;

          if(e.guild.me.hasPermission('MANAGE_MESSAGES')) {
            reaction.users.forEach(user => {
              reaction.remove(user).catch(console.error);
            });
          }else {
            reaction.remove().catch(console.error);
          }
        });
      }
    }).catch(console.error);
  });
};

function decode(text) {
  let entities = preload_data.html_entities;

  for(let i in entities) {
    text = text.split(i).join(entities[i]);
  }

  return text;
}