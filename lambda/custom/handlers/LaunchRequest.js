const { canHandle, getRandomMessage } = require('ask-utils')
const { getSkillName, STATES } = require('../constants')

// utils
const { getLocale } = require('../libs/utils')

class Response {
  constructor (handlerInput) {
    this.handlerInput = handlerInput
    this.locale = getLocale(handlerInput)
    this.skillName = getSkillName(this.locale)
  }
  getSkillName () {
    return this.skillName
  }
  getSpeech () {
    const speech = {
      'ja-JP': `${this.skillName}へようこそ。`,
      'en-US': `Welcome to the ${this.skillName} . `
    }
    return speech[this.locale]
  }
  getRepropt () {
    const reprompts = {
      'ja-JP': [
        'カルタゲームを始めますか？',
        'ゲームを始めますか？'
      ],
      'en-US': [
        'Will you play karuta game ?',
        'Will you play the game ?'
      ]
    }
    return getRandomMessage(reprompts[this.locale])
  }
}

const LaunchRequestHandler = {
  canHandle: (handlerInput) => canHandle(handlerInput, 'LaunchRequest'),
  handle: (handlerInput) => {
    console.log('LaunchRequest: %j', handlerInput)
    const response = new Response(handlerInput)

    const reprompt = response.getRepropt()
    const speech = response.getSpeech()
    // const skillName = response.getSkillName()

    handlerInput.attributesManager.setSessionAttributes({
      state: STATES.start,
      reservedQuiz: []
    })
    return handlerInput.responseBuilder
      .speak(speech + reprompt)
      .reprompt(reprompt)
      // .withSimpleCard(skillName, speech)
      .getResponse()
  }
}
module.exports = LaunchRequestHandler
