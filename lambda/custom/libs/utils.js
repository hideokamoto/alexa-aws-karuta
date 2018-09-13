export const getLocale = (handlerInput, defaultLocale = 'en-US') => {
  if (
    handlerInput.requestEnvelope &&
    handlerInput.requestEnvelope.request
  ) {
    return handlerInput.requestEnvelope.request.locale || defaultLocale
  }
  return defaultLocale
}
