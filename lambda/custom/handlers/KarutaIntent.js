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
    const speech = `カルタを始めます。問題、${quiz.description}。<break time="5s"/>正解は${quiz.name}です。`
    handlerInput.attributesManager.setSessionAttributes({
        state: STATES.start,
        answer: quiz.name,
        quiz: quiz.description
    })
    return handlerInput.responseBuilder
      .speak(speech)
      .withSimpleCard(`${SKILL_NAME}： 問題`, quiz.description)
      .getResponse()
  }
}
module.exports = KarutaIntenttHandler
