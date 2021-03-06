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
        '<p>わかりました。もう一度読み上げます。</p>',
        `<p>問題、${quiz.description}</p>`,
        '<p>このサービスはなんでしょう？</p>',
        "<audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3'/>",
        "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_bell_timer_01.mp3'/>",
        `<p>時間となりました。正解は<break time="0.3s" />${quiz.name_kana}です。</p>`
      ],
      'en-US': [
        "<p>OK. I'll say again.</p>",
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
  canHandle: (handlerInput) => canHandle(handlerInput, 'IntentRequest', 'AMAZON.RepeatIntent'),
  handle: (handlerInput) => {
    console.log('AMAZON.RepeatIntent: %j', handlerInput)
    const response = new Response(handlerInput)
    const { state, quiz } = handlerInput.attributesManager.getSessionAttributes()
    const reprompt = response.getRepropt()
    // const skillName = response.getSkillName()
    if (state !== STATES.start || !quiz || !quiz.description) {
      handlerInput.attributesManager.setSessionAttributes({
        state: STATES.start
      })
      return handlerInput.responseBuilder
        .speak(response.getUndefinedStateResponse())
        .reprompt(reprompt)
        // .withSimpleCard(skillName, quiz.description)
        .getResponse()
    }
    response.setQuiz(quiz)
    const speech = `${response.getSpeech()}${response.getNextAction()}`
    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(reprompt)
      // .withSimpleCard(skillName, quiz.description)
      .getResponse()
  }
}
module.exports = IntentHandler
