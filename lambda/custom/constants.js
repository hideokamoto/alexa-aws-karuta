export const SKILL_ID = 'amzn1.ask.skill.8d4f3bd7-e62b-4506-b5a9-67f738f78022'
export const STATES = {
  START: 'start',
  KARUTA: 'karuta',
  HINT: 'hint'
}
export const getSkillName = (locale) => {
  switch(locale) {
    case 'ja-JP':
      return 'JAWS カルタ'
    case 'en-US':
    default:
      return 'JAWS karuta game'
  }
}