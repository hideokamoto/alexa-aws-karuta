const { canHandle, getRandomMessage } = require('ask-utils')
const { getSkillName, STATES } = require('../constants')
const quizItems = require('../libs/quiz')

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
  getQuiz () {
    return getRandomMessage(quizItems[this.locale])
  }
  getSpeech () {
    const quiz = this.getQuiz()
    const speech = {
      'ja-JP': [
        '<p>カルタを始めます。</p>',
        `<p>問題、${quiz.description}</p>`,
        '<p>このサービスはなんでしょう？</p>',
        "<audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3'/>",
        "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_bell_timer_01.mp3'/>",
        `<p>時間となりました。正解は<break time="0.3s" />${quiz.name_kana}です。</p>`
      ],
      'en-US': [
        "<p>OK. Let's start the game.</p>",
        '<p>Question, what is the service description?</p>',
        `<p>${quiz.description}</p>`,
        "<audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3'/>",
        "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_bell_timer_01.mp3'/>",
        '<p>It is time !</p>',
        `<p>The correct anser is <break time="0.3s" />${quiz.name}.</p>`
      ]
    }
    return speech[this.locale].join('')
  }
  getNextAction () {
    const actions = {
      'ja-JP': [
        '次のゲームを始めますか？',
        '次に行きますか？'
      ],
      'en-US': [
        'Will you play next game ?',
        'Will you go next ?'
      ]
    }
    return getRandomMessage(actions[this.locale])
  }
  getRepropt () {
    const reprompts = {
      'ja-JP': [
        'カルタゲームを続けますか？終了する場合は、ストップと話しかけてください。',
        'ゲームを続けますか？終了する場合は、ストップと話しかけてください。'
      ],
      'en-US': [
        'Will you play next game ? If not, please say Stop.'
      ]
    }
    return getRandomMessage(reprompts[this.locale])
  }
}

const KarutaIntenttHandler = {
  canHandle: (handlerInput) => {
    if (canHandle(handlerInput, 'IntentRequest', 'KarutaIntent')) return true
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    if (canHandle(handlerInput, 'IntentRequest', 'AMAZON.YesIntent') && attributes.state === STATES.start) return true
    return false
  },
  handle: (handlerInput) => {
    console.log('KarutaIntentt: %j', handlerInput)
    const response = new Response(handlerInput)
    const quiz = response.getQuiz()
    const reprompt = response.getRepropt()
    const speech = `${response.getSpeech()}${response.getNextAction()}`
    const skillName = response.getSkillName()
    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(reprompt)
      .withSimpleCard(skillName, quiz.description)
      .getResponse()
  }
}
module.exports = KarutaIntenttHandler
