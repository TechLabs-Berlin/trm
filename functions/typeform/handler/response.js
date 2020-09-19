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

const getResponse = ({typeformResponseToken, typeformEvent, answers, fields, formID}) => {
  const processedAnswers = answers.reduce((answers, answer, i) => {
    if(
      !('field' in answer) ||
      !('ref' in answer.field) ||
      isUUID(answer.field.ref)) {
      return answers
    }

    const genericFields = { index: i }
    let field = null
    if(answer.field.id) {
      field = fields.find(f => f.id === answer.field.id)
    }
    if(field && field.title) {
      genericFields.title = field.title
    }

    const processedAnswer = getAnswer(answer)
    if(!processedAnswer) {
      return answers
    }

    answers[answer.field.ref] = {
      ...genericFields,
      ...processedAnswer
    }
    return answers
  }, {})

  return {
    answers: processedAnswers,
    typeformResponseToken,
    typeformEvent,
    formID
  }
}

module.exports = {
  isUUID,
  getAnswer,
  getResponse
}
