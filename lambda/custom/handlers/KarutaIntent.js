const { canHandle, getRandomMessage } = require('ask-utils')
const { getSkillName, STATES } = require('../constants')

// utils
const { getLocale } = require('../libs/utils')
const { generateQuiz } = require('../libs/quizUtils')

class Response {
  constructor (handlerInput) {
    this.handlerInput = handlerInput
    this.locale = getLocale(handlerInput)
    this.skillName = getSkillName(this.locale)
    const attributes = this.handlerInput.attributesManager.getSessionAttributes()
    this.quiz = generateQuiz(attributes, this.locale)
  }
  getSkillName () {
    return this.skillName
  }
  getQuiz () {
    return this.quiz
  }
  getSpeech () {
    const quiz = this.getQuiz()
    const speech = {
      'ja-JP': [
        '<p>カルタを始めます。</p>',
        `<p>問題、${quiz.description}</p>`,
        '<p>このサービスはなんでしょう？</p>'
      ],
      'en-US': [
        "<p>OK. Let's start the game.</p>",
        '<p>Question, what is the service description?</p>',
        `<p>${quiz.description}</p>`
      ]
    }
    const timers = getRandomMessage([
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3'/>",
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3'/>",
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3'/>",
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3'/>",
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/nature/amzn_sfx_ocean_wave_surf_01.mp3'/>"
    ])
    const finishBell = getRandomMessage([
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_bell_timer_01.mp3'/>",
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_bell_timer_01.mp3'/>",
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_bell_timer_01.mp3'/>",
      "<audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_glasses_clink_01.mp3'/>"
    ])
    const answer = {
      'ja-JP': [
        `<p>時間となりました。正解は<break time="0.3s" />${quiz.name_kana}です。</p>`
      ],
      'en-US': [
        '<p>It is time !</p>',
        `<p>The correct anser is <break time="0.3s" />${quiz.name}.</p>`
      ]
    }
    return `${speech[this.locale].join('')}${timers}${finishBell}${answer[this.locale].join('')}`
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

const getReservedQuiz = (attributes, quiz) => {
  const reservedQuiz = attributes.reservedQuiz || []
  reservedQuiz.push(quiz)
  return reservedQuiz
}

const getFinishedQuizResponse = handlerInput => {
  const locale = getLocale(handlerInput)
  const speech = {
    'ja-JP': [
      '全ての問題が終了しました。また遊んでくださいね。',
      '全ての問題が終了しました。点数はどうでしたでしょうか？また遊んでくださいね。'
    ],
    'en-US': [
      'Congratulations! The game is end ! Thanks for playing.',
      'Congratulations! The game is end . See you again !'
    ]
  }
  return handlerInput.responseBuilder
    .speak(getRandomMessage(speech[locale]))
    .withSimpleCard(getSkillName(locale), 'Thank you for playing :)')
    .getResponse()
}

const KarutaIntenttHandler = {
  canHandle: (handlerInput) => {
    if (canHandle(handlerInput, 'IntentRequest', 'KarutaIntent')) return true
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    console.log('Attributes: %j', attributes)
    if (canHandle(handlerInput, 'IntentRequest', 'AMAZON.YesIntent')) return true
    if (canHandle(handlerInput, 'IntentRequest', 'AMAZON.NextIntent')) return true
    return false
  },
  handle: (handlerInput) => {
    console.log('KarutaIntentt: %j', handlerInput)
    const response = new Response(handlerInput)
    const attributes = handlerInput.attributesManager.getSessionAttributes()
    const quiz = response.getQuiz()
    if (Object.keys(quiz).length === 0) {
      return getFinishedQuizResponse(handlerInput)
    }
    handlerInput.attributesManager.setSessionAttributes({
      state: STATES.start,
      quiz,
      reservedQuiz: getReservedQuiz(attributes, quiz.name)
    })
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
