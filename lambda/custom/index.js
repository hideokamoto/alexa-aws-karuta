const Alexa = require('ask-sdk')
const { getRandomMessage, canHandle } = require('ask-utils')
const { getLocale } = require('./libs/utils')
const { STATES, SKILL_ID } = require('./constants')

const skillBuilder = Alexa.SkillBuilders.standard()
// handlers
const LaunchRequestHandler = require('./handlers/LaunchRequest')
const KarutaIntentHandler = require('./handlers/KarutaIntent')
const RepeatIntentHandler = require('./handlers/RepeatIntent')
const AnswerIntentHandler = require('./handlers/AnswerIntent')

const ErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    console.log(`Error handled: ${error.message}`)
    console.log(error)
    const locale = getLocale(handlerInput)
    if (locale === 'ja-JP') {
      const action = getRandomMessage([
        'もう一度話しかけてもらえませんか？',
        'もう一度試してみてください。',
        '何について調べたいですか？'
      ])
      return handlerInput.responseBuilder
        .speak(`すみません。上手く聞き取れませんでした。${action}`)
        .reprompt(action)
        .getResponse()
    }
    const action = getRandomMessage([
      'Please say it again',
      'What do you want to do?'
    ])

    return handlerInput.responseBuilder
      .speak(`Sorry, I can't find the content.${action}`)
      .reprompt(action)
      .getResponse()
  }
}

const HelpHandler = {
  canHandle: (handlerInput) => canHandle(handlerInput, 'IntentRequest', 'AMAZON.HelpIntent'),
  handle: (handlerInput) => {
    const locale = getLocale(handlerInput)
    handlerInput.attributesManager.setSessionAttributes({
      state: STATES.start,
      quiz: ''
    })
    let speech
    let action
    let reprompt
    if (locale === 'ja-JP') {
      speech = getRandomMessage([
        'このスキルは、AWSサービス名の説明文を読み上げるスキルです。指定された時間内に、サービス名を答えましょう。',
        'このスキルは、AWSカルタの読み手スキルです。'
      ])
      action = getRandomMessage([
        'ゲームを開始するには、「ゲームを開始」と話しかけてください。ゲームを開始しますか？',
        '「カルタを開始」と話しかけることでゲームを開始できます。ゲームを開始しますか？'
      ])
      reprompt = getRandomMessage([
        'ゲームを終了する場合は、「終了」といってください。'
      ])
    } else {
      speech = getRandomMessage([
        "The skill is to play AWS karuga game. I'll talk about the service description, please find out the correct service name card."
      ])
      action = getRandomMessage([
        'Will you play the game ? If yes, please say "Start the game"',
        'You can start the game by saying "Start the game". Will you play?'
      ])
      reprompt = getRandomMessage([
        'If you want to stop the game, please say stop.'
      ])
    }
    return handlerInput.responseBuilder
      .speak(`${speech}${action}`)
      .reprompt(`${action}${reprompt}`)
      .getResponse()
  }
}

const StopSessionHandler = {
  canHandle: (handlerInput) => {
    if (canHandle(handlerInput, 'IntentRequest', 'AMAZON.CancelIntent')) return true
    if (canHandle(handlerInput, 'IntentRequest', 'AMAZON.StopIntent')) return true
    if (canHandle(handlerInput, 'IntentRequest', 'AMAZON.NoIntent')) return true
    if (canHandle(handlerInput, 'SessionEndedRequest')) return true
    return false
  },
  handle: (handlerInput) => {
    if (canHandle(handlerInput, 'SessionEndedRequest')) {
      console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`)
      return handlerInput.responseBuilder.getResponse()
    }
    handlerInput.attributesManager.setSessionAttributes({
      state: '',
      quiz: ''
    })
    const locale = getLocale(handlerInput)
    if (locale === 'ja-JP') {
      const speech = getRandomMessage([
        '使ってくれてありがとうございます。またいつでもどうぞ',
        'またお気軽に話しかけてくださいね。',
        'それでは、また。'
      ])

      return handlerInput.responseBuilder
        .speak(speech)
        .getResponse()
    }
    const speech = getRandomMessage([
      'Thank you for playing the game. See you again!',
      'Thanks for playing ! Have a nice day.'
    ])

    return handlerInput.responseBuilder
      .speak(speech)
      .getResponse()
  }
}

exports.handler = skillBuilder
  .addRequestHandlers(
    KarutaIntentHandler,
    LaunchRequestHandler,
    AnswerIntentHandler,
    RepeatIntentHandler,
    StopSessionHandler,
    HelpHandler
  )
  .withSkillId(SKILL_ID)
  .addErrorHandlers(ErrorHandler)
  .lambda()
