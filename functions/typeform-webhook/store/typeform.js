const typeformAPIBaseURL = 'https://api.typeform.com'
const webhookTag = 'trm' // TODO this should be environment-specific -> read NODE_ENV

module.exports = ({fetch, log}) => {
  return {
    // see https://developer.typeform.com/webhooks/reference/retrieve-single-webhook/
    checkWebhook: async ({ typeformID, typeformToken }) => {
      const url = `${typeformAPIBaseURL}/forms/${typeformID}/webhooks/${webhookTag}`
      const resp = await fetch(
        url,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${typeformToken}`
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
    updateWebhook: async ({typeformID, callbackURL, secret, typeformToken}) => {
      const url = `${typeformAPIBaseURL}/forms/${typeformID}/webhooks/${webhookTag}`
      const resp = await fetch(
        url,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${typeformToken}`
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
