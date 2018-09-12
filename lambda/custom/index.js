const Alexa = require('ask-sdk')
const { getRandomMessage, canHandle } = require('ask-utils')
const { getAskMessage, getReprompt } = require('./libs/utils')

const skillBuilder = Alexa.SkillBuilders.standard()
// handlers
const LaunchRequestHandler = require('./handlers/LaunchRequest')
const KarutaIntentHandler = require('./handlers/KarutaIntent')

const RepeatIntentHandler = {
  canHandle: (handlerInput) => canHandle(handlerInput, 'IntentRequest', 'AMAZON.RepeatIntent'),
  handle: (handlerInput) => {
    const { repeatContent } = handlerInput.attributesManager.getSessionAttributes()
    const ask = getAskMessage()
    const reprompt = getReprompt()
    const repromptMessage = `${ask}${reprompt}`
    if (!repeatContent || !repeatContent.speak) {
      return handlerInput.responseBuilder
        .speak(`すみません。コンテンツが見つかりませんでした。${ask}`)
        .reprompt(repromptMessage)
        .getResponse()
    }
    return handlerInput.responseBuilder
      .speak(`${repeatContent.speak}${ask}`)
      .reprompt(reprompt)
      .withSimpleCard(repeatContent.card.title, repeatContent.card.content)
      .getResponse()
  }
}

const ErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    console.log(`Error handled: ${error.message}`)
    console.log(error)
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
      lastContent: ''
    })
    const speech = getRandomMessage([
      '使ってくれてありがとうございます。またいつでもどうぞ',
      'またお気軽に話しかけてくださいね。',
      'それでは、また。'
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
    StopSessionHandler,
    RepeatIntentHandler
  )
  // .withSkillId('amzn1.ask.skill.f35b1223-1ed1-4283-a207-0e5d0fd2ff05')
  .addErrorHandlers(ErrorHandler)
  .lambda()
