const querystring = require('querystring')

const typeformAPIBaseURL = 'https://api.typeform.com'

module.exports = ({fetch, log}) => {
  const getFormResponsesPage = async ({ id, token, lastResponseToken }) => {
    let query = {
      page_size: 100
    }
    if(lastResponseToken) {
      query.after = lastResponseToken
    }
    const resp = await fetch(
      `${typeformAPIBaseURL}/forms/${id}/responses?${querystring.stringify(query)}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )

    const result = await resp.json()

    if(!resp.ok) {
      log.debug(`Typeform API returned an error`, { error: result })
        return Promise.reject({
          reason: `Type{form API responded with ${resp.status}`,
          error: result
        })
    }

    if(!('items' in result)) {
      return Promise.reject({
        reason: 'Typeform API returned invalid response, expected to find items',
        error: result
      })
    }

    // initially the response is sorted by submitted_at DESC (newest response on top),
    // with after= it is sorted so that the newest response is at the bottom
    // so we need to take the first token if lastResponseToken is unset and the last token otherwise
    if(result.items.length > 0) {
      if(lastResponseToken) {
        lastResponseToken = result.items[result.items.length-1].token
      } else {
        lastResponseToken = result.items[0].token
      }
    } else {
      lastResponseToken = null
    }

    return {
      responses: result.items,
      lastResponseToken
    }
  }

  return {
    getFormResponsesPaginated: async ({ id, token, callback }) => {
      let responses = []
      let lastResponseToken = null
      do {
        const result = await getFormResponsesPage({ id, token, lastResponseToken })
        responses = result.responses
        lastResponseToken = result.lastResponseToken
        if(responses.length > 0) {
          await callback(responses)
        }
      } while(responses.length > 0 && lastResponseToken !== null)
    }
  }
}
