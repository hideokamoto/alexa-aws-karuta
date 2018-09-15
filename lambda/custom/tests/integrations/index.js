const alexaTest = require('alexa-skill-test-framework')
alexaTest.initialize(
  require('../../index.js'),
  'amzn1.ask.skill.000000-0000-0000-0000',
  'amzn1.ask.account.VOID',
  'amzn1.ask.device.VOID'
)

module.exports.alexaTest = alexaTest
