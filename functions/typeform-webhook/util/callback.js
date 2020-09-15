const querystring = require('querystring')

module.exports = {
  createFullCallbackURL: ({callbackURL, formID}) => {
    const query = querystring.stringify({ op: 'one', formID })
    return `${callbackURL}?${query}`
  }
}
