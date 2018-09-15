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
    this.quiz = getRandomMessage(quizItems[this.locale])
  }
  getSkillName () {
    return this.skillName
  }
  setQuiz (quiz) {
    this.quiz = quiz
  }
  getQuiz () {
    return this.quiz
  }
  getSpeech () {
    const quiz = this.getQuiz()
    const speech = {
      'ja-JP': [
        "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_bell_timer_01.mp3'/>",
        `<p>正解は<break time="0.3s" />${quiz.name_kana}です。</p>`
      ],
      'en-US': [
        "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_bell_timer_01.mp3'/>",
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
  getUndefinedStateResponse () {
    const speech = {
      'ja-JP': [
        'すみません。上手く聞き取れませんでした。カルタを始めますか？',
        '上手に聞き取れませんでした。カルタを始めますか？'
      ],
      'en-US': [
        'Sorry, I beg your pardon ? Will you start the game ?',
        "Sorry, I couldn't here you speach ? Will you start the karuta game ?"
      ]
    }
    return getRandomMessage(speech[this.locale])
  }
}

const IntentHandler = {
  canHandle: (handlerInput) => canHandle(handlerInput, 'IntentRequest', 'AnswerIntent'),
  handle: (handlerInput) => {
    console.log('AnswerIntent: %j', handlerInput)
    const response = new Response(handlerInput)
    const { quiz } = handlerInput.attributesManager.getSessionAttributes()
    const reprompt = response.getRepropt()
    const skillName = response.getSkillName()
    if (!quiz || !quiz.description) {
      handlerInput.attributesManager.setSessionAttributes({
        state: STATES.start
      })
      return handlerInput.responseBuilder
        .speak(response.getUndefinedStateResponse())
        .reprompt(reprompt)
        .withSimpleCard(skillName, quiz.name)
        .getResponse()
    }
    response.setQuiz(quiz)
    const speech = `${response.getSpeech()}${response.getNextAction()}`
    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(reprompt)
      .withSimpleCard(skillName, quiz.name)
      .getResponse()
  }
}
module.exports = IntentHandler
