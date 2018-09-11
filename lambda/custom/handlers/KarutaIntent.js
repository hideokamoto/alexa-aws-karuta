const { canHandle, getRandomMessage } = require('ask-utils')
const { SKILL_NAME, STATES } = require('../constants')
const quizItems = require('../libs/quiz')

const KarutaIntenttHandler = {
  canHandle: (handlerInput) => canHandle(handlerInput, 'IntentRequest', 'KarutaIntent'),
  handle: (handlerInput) => {
    console.log('KarutaIntentt: %j', handlerInput)
    const quiz = getRandomMessage(quizItems['ja'])
    
    const reprompts = [
      'カルタゲームを始めますか？',
      'カルタゲームを始めますか？ルールについて確認しますか？'
    ]
    const speech = [
      '<p>カルタを始めます。</p>',
      `<p>問題、${quiz.description}</p>`,
      '<p>このサービスはなんでしょう？</p>',
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3'/>",
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_bell_timer_01.mp3'/>",
      `<p>時間となりました。正解は<break time="0.3s" />${quiz.name_kana}です。</p>`
    ]
    handlerInput.attributesManager.setSessionAttributes({
        state: STATES.start,
        answer: quiz.name,
        quiz: quiz.description
    })
    return handlerInput.responseBuilder
      .speak(speech.join(''))
      .withSimpleCard(`${SKILL_NAME}： 問題`, quiz.description)
      .getResponse()
  }
}
module.exports = KarutaIntenttHandler
