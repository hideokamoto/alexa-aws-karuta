const { alexaTest } = require('./index')
describe('Ensligh', () => {
  alexaTest.setLocale('en-US')
  describe('LaunchRequest', function () {
    alexaTest.test([
      {
        request: alexaTest.getLaunchRequest(),
        saysLike: 'AWS Karuta',
        repromptsLike: 'game'
      },
      {
        request: alexaTest.getIntentRequest('KarutaIntent'),
        saysLike: "OK. Let's start the game."
      }
    ])
  })
  describe('Multipile usage', function () {
    alexaTest.test([
      {
        request: alexaTest.getLaunchRequest(),
        saysLike: 'AWS Karuta',
        repromptsLike: 'game'
      },
      {
        request: alexaTest.getIntentRequest('KarutaIntent'),
        saysLike: "OK. Let's start the game."
      },
      {
        request: alexaTest.getIntentRequest('KarutaIntent'),
        saysLike: "OK. Let's start the game."
      },
      {
        request: alexaTest.getIntentRequest('AMAZON.YesIntent'),
        saysLike: "OK. Let's start the game."
      },
      {
        request: alexaTest.getIntentRequest('KarutaIntent'),
        saysLike: "OK. Let's start the game."
      },
      {
        request: alexaTest.getIntentRequest('KarutaIntent'),
        saysLike: "OK. Let's start the game."
      }
    ])
  })
  describe('AnswerIntent', function () {
    alexaTest.test([
      {
        request: alexaTest.getLaunchRequest(),
        saysLike: 'AWS Karuta',
        repromptsLike: 'game'
      },
      {
        request: alexaTest.getIntentRequest('KarutaIntent'),
        saysLike: "OK. Let's start the game."
      },
      {
        request: alexaTest.getIntentRequest('AnswerIntent'),
        saysLike: 'The correct anser is'
      }
    ])
  })
  describe('AnswerIntent', function () {
    alexaTest.test([
      {
        request: alexaTest.getLaunchRequest(),
        saysLike: 'AWS Karuta',
        repromptsLike: 'game'
      },
      {
        request: alexaTest.getIntentRequest('KarutaIntent'),
        saysLike: "OK. Let's start the game."
      },
      {
        request: alexaTest.getIntentRequest('AnswerIntent'),
        saysLike: 'The correct anser is'
      }
    ])
  })
})
