const { getRandomMessage } = require('ask-utils')
const quizItems = require('./quiz')

const generateQuiz = (attributes, locale = 'en-US') => {
  const quiz = getRandomMessage(quizItems[locale])
  if (!attributes.reservedQuiz) return quiz
  if (attributes.reservedQuiz.indexOf(quiz.name) !== -1) {
    return generateQuiz(attributes, locale)
  }
  return quiz
}

module.exports = {
  generateQuiz
}
