const querystring = require('querystring')

module.exports = {
  createFullCallbackURL: ({callbackURL, formID}) => {
    const query = querystring.stringify({ formID })
    return `${callbackURL}?${query}`
  }
}
