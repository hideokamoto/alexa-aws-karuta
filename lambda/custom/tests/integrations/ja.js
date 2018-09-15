const { alexaTest } = require('./index')

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
