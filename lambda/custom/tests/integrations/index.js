const alexaTest = require('alexa-skill-test-framework')
alexaTest.initialize(
  require('../../index.js'),
  'amzn1.ask.skill.000000-0000-0000-0000',
  'amzn1.ask.account.VOID',
  'amzn1.ask.device.VOID'
)
describe('日本語', () => {
  alexaTest.setLocale('ja-JP')
  describe('LaunchRequest', function () {
    alexaTest.test([
      {
        request: alexaTest.getLaunchRequest(),
        saysLike: 'AWS カルタへようこそ。',
        repromptsLike: 'ゲームを始めますか？'
      },
      {
          request: alexaTest.getIntentRequest('KarutaIntent'),
          saysLike: 'カルタを始めます。',
          repromptsLike: '続けますか？'
      },
      {
          request: alexaTest.getIntentRequest('AMAZON.YesIntent'),
          saysLike: 'カルタを始めます。',
          repromptsLike: '続けますか？'
      },
      {
          request: alexaTest.getIntentRequest('AMAZON.StopIntent'),
          saysLike: 'また',
          shouldEndSession: true
      }
    ])
  })
})

describe('Ensligh', () => {
  alexaTest.setLocale('en-US')
  describe('LaunchRequest', function () {
    alexaTest.test([
      {
        request: alexaTest.getLaunchRequest(),
        saysLike: 'AWS karuta',
        repromptsLike: 'game'
      },
      {
          request: alexaTest.getIntentRequest('KarutaIntent'),
          saysLike: "OK. Let's start the game."
      }
    ])
  })
})