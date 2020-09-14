const uuid = require('uuid')

const isUUID = (uuidStr) => {
  try {
    uuid.parse(uuidStr)
  } catch(err) {
    return false
  }
  return true
}

const getAnswer = (answer) => {
  switch(answer.type) {
    case 'text':
      return {
        type: 'text',
        value: answer.text
      }
    case 'choice':
      return {
        type: 'choice',
        value: answer.choice.label
      }
    case 'choices':
      return {
        type: 'choices',
        value: answer.choices.labels
      }
    case 'phone_number':
      return {
        type: 'phone_number',
        value: answer.phone_number
      }
    case 'boolean':
      return {
        type: 'boolean',
        value: answer.boolean
      }
    case 'email':
      return {
        type: 'email',
        value: answer.email
      }
    case 'number':
      return {
        type: 'number',
        value: answer.number
      }
    case 'date':
      return {
        type: 'date',
        value: answer.date
      }
    case 'file_url':
      return {
        type: 'file_url',
        value: answer.file_url
      }
    case 'url':
      return {
        type: 'url',
        value: answer.url
      }
    default:
      return null
  }
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

    const processedAnswer = getAnswer(answer)
    if(!processedAnswer) {
      return answers
    }

    answers[answer.field.ref] = processedAnswer
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
  getAnswer,
  getResponse
}
