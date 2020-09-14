const uuid = require('uuid')

const isUUID = (uuidStr) => {
  try {
    uuid.parse(uuidStr)
  } catch(err) {
    return false
  }
  return true
}

const getResponse = ({typeformResponseToken, typeformEvent, response, formID}) => {
  if(!('answers' in response)) {
    throw new Error('expected answers to be included in response')
  }
  const answers = response.answers.reduce((answers, answer) => {
    if(
      !('field' in answer) ||
      !('ref' in answer.field) ||
      isUUID(answer.field.ref)) {
      return answers
    }

    answers[answer.field.ref] = answer.text
    return answers
  }, {})

  return {
    typeformResponseToken,
    typeformEvent,
    answers,
    formID
  }
}

module.exports = {
  isUUID,
  getResponse
}
