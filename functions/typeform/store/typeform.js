const querystring = require('querystring')

const typeformAPIBaseURL = 'https://api.typeform.com'
const webhookTag = 'trm'

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
    },

    getForm: async ({ id, token }) => {
      const url = `${typeformAPIBaseURL}/forms/${id}`
      const resp = await fetch(
        url,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const body = await resp.json()

      if(!resp.ok) {
        log.debug(`getForm at ${url} returned an error`, { error: body })
        return Promise.reject({
          reason: `Typeform getForm responded with ${resp.status}`,
          error: body
        })
      }

      log.debug(`Form from ${url}`, { body })
      return body
    },

    // see https://developer.typeform.com/webhooks/reference/retrieve-single-webhook/
    checkWebhook: async ({ id, token }) => {
      const url = `${typeformAPIBaseURL}/forms/${id}/webhooks/${webhookTag}`
      const resp = await fetch(
        url,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if(resp.status === 404) {
        log.debug(`Webhook ${url} doesn't exist`)
        return { installed: false }
      }

      if(!resp.ok) {
        const body = await resp.json()
        log.debug(`Webhook ${url} returned an error`, { error: body })
        return Promise.reject({
          reason: `Typeform API responded with ${resp.status}`,
          error: body
        })
      }

      const hook = await resp.json()
      log.debug(`Webhook from ${url}`, { hook })

      return {
        installed: true,
        url: hook.url
      }
    },

    // see https://developer.typeform.com/webhooks/reference/create-or-update-webhook/
    updateWebhook: async ({id, callbackURL, secret, token}) => {
      const url = `${typeformAPIBaseURL}/forms/${id}/webhooks/${webhookTag}`
      const resp = await fetch(
        url,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            enabled: true,
            verify_ssl: true,
            url: callbackURL,
            secret
          })
        }
      )

      if(!resp.ok) {
        const body = await resp.json()
        log.debug(`Updating Webhook ${url} returned an error`, { error: body })
        return Promise.reject({
          reason: `Typeform API responded with ${resp.status}`,
          error: body,
        })
      }
      log.debug(`Updating Webhook ${url} successful`)
      return Promise.resolve()
    }
  }
}
