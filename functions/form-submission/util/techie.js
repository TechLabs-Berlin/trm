const pick = (o, ...fields) => {
  return fields.reduce((a, x) => {
      if(o.hasOwnProperty(x)) a[x] = o[x];
      return a;
  }, {});
}

const answerExtractors = {
  email(answer) {
    if(answer.type !== 'email') {
      return {}
    }
    return { email: answer.value }
  },
  first_name(answer) {
    if(answer.type !== 'text') {
      return {}
    }
    return { first_name: answer.value }
  },
  last_name(answer) {
    if(answer.type !== 'text') {
      return {}
    }
    return { last_name: answer.value }
  }
}

module.exports = {
  processTechieMasterData: ({attributes, formAnswers}) => {
    const attributesWithExtractors = Object.entries(formAnswers).reduce((attrs, [field, answer]) => {
      if(field in answerExtractors) {
        const result = answerExtractors[field](answer)
        Object.assign(attrs, result)
      }
      return attrs
    }, attributes)

    // selects the given keys from attributesWithExtractors
    const selectedAttributes = pick(
      attributesWithExtractors,
      'id', 'email', 'first_name', 'last_name', 'state', 'techie_key'
    )

    return selectedAttributes
  },
  answerExtractors
}
