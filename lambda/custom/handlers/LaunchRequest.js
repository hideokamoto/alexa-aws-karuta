const { canHandle, getRandomMessage } = require('ask-utils')
const { SKILL_NAME, STATES } = require('../constants')

const LaunchRequestHandler = {
  canHandle: (handlerInput) => canHandle(handlerInput, 'LaunchRequest'),
  handle: (handlerInput) => {
    console.log('LaunchRequest: %j', handlerInput)
    const reprompts = [
      'カルタゲームを始めますか？',
      'カルタゲームを始めますか？ルールについて確認しますか？'
    ]
    const reprompt = getRandomMessage(reprompts)
    const speech = `${SKILL_NAME}へようこそ。${reprompt}`
    handlerInput.attributesManager.setSessionAttributes({
        state: STATES.start
    })
    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(reprompt)
      .withSimpleCard(`${SKILL_NAME}`, speech)
      .getResponse()
  }
}
module.exports = LaunchRequestHandler
