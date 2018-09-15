const { getRandomMessage } = require('ask-utils')
const quizItems = require('./quiz')

const generateQuiz = (attributes, locale = 'en-US') => {
  const items = quizItems[locale]
  const quiz = getRandomMessage(items)
  if (!attributes.reservedQuiz) return quiz
  if (attributes.reservedQuiz.length >= items.length) return {}
  if (attributes.reservedQuiz.indexOf(quiz.name) !== -1) {
    return generateQuiz(attributes, locale)
  }
  return quiz
}

module.exports = {
  generateQuiz
}
