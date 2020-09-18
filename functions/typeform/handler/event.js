const callbackUtil = require('../util/callback')
const responseHandler = require('../handler/response')

const tableName = 'forms'

module.exports = ({hasura, typeform, functionURL, log}) => {
  return {
    // see https://developer.typeform.com/webhooks/example-payload/
    handleOne: async ({formID, payload}) => {
      const id = payload.event_id

      log.info(`Received event ${id}`, { type: 'one', id })
      log.debug('Event details', { type: 'one', id, payload })

      if(payload.event_type !== 'form_response') {
        log.info(`unsupported event type ${payload.event_type}`, { type: 'one', id })
        return Promise.reject(`Unsupported event type ${payload.event_type}`)
      }

      const response = payload.form_response
      if(!response) {
        return Promise.reject('Payload does not contain form_response')
      }

      const { token } = response
      if(!token) {
        return Promise.reject('form_response does not contain token')
      }

      const formResponseExists = await hasura.doesFormResponseExist({
        typeformResponseToken: token,
        formID
      })

      if(formResponseExists) {
        log.info(`Form response with token ${token} exists, ignoring`, { type: 'one', id })
        return
      }

      const formResponseID = await hasura.createFormResponse(
        responseHandler.getResponse({
          typeformResponseToken: token,
          typeformEvent: payload,
          response,
          formID
        })
      )

      log.info(`Created form response ID ${formResponseID}`, { type: 'one', id })

      return
    },

    handleAll: async ({payload}) => {
      const { id } = payload

      log.info(`Received event ${id}`, { type: 'all', id })
      log.debug(`Event details`, { type: 'all', id, payload })

      if(payload.table.name !== tableName) {
        log.info(`Event doesn't belong to ${tableName}, ignoring`, { type: 'all', id })
        return Promise.reject(`Event doesn't belong to ${tableName}`)
      }
      const newState = payload.event.data.new
      const typeformToken = await hasura.getTypeformToken({ location: newState.location })
      const webhookCallbackURL = callbackUtil.createFullCallbackURL({
        formID: newState.id,
        callbackURL: functionURL
      })

      let webhookNeedsUpdate = false

      if(!newState.webhook_installed_at) {
        webhookNeedsUpdate = true
      }
      if(!webhookNeedsUpdate) {
        const existingWebhook = await typeform.checkWebhook({
          id: newState.typeform_id,
          token: typeformToken
        })
        if(!existingWebhook.installed) {
          webhookNeedsUpdate = true
        } else if(existingWebhook.url !== webhookCallbackURL) {
          webhookNeedsUpdate = true
        }
      }
      if(!webhookNeedsUpdate) {
        log.info('Webhook doesn\'t need update', { id })
      } else {
        await typeform.updateWebhook({
          id: newState.typeform_id,
          callbackURL: webhookCallbackURL,
          secret: newState.secret,
          token: typeformToken
        })
        log.info('Webhook updated', { id })
        await hasura.setWebhookInstalledAt({
          formID: newState.id
        })
        log.info('webhook_installed_at updated', { id })
      }

      await typeform.getFormResponsesPaginated({
        id: newState.typeform_id,
        token: typeformToken,
        callback: async (responses) => {
          const typeformResponseTokens = responses.map(r => r.token)
          const existingTypeformResponseTokens = await hasura.getExistingTypeformResponseTokensForForm({
            formID: newState.id,
            typeformResponseTokens
          })
          const newTypeformResponseTokens = typeformResponseTokens.filter(t => !existingTypeformResponseTokens.includes(t))
          log.debug(`Found ${newTypeformResponseTokens.length} new responses, importing`, { type: 'all', id })
          for(const typeformResponseToken of newTypeformResponseTokens) {
            const response = responses.find(r => r.token === typeformResponseToken)
            if(!response) {
              log.warning(`Expected to find response with token ${typeformResponseToken} but didn't`, { type: 'all', id })
              continue
            }
            const formResponseID = await hasura.createFormResponse(
              responseHandler.getResponse({
                typeformEvent: response,
                formID: newState.id,
                typeformResponseToken,
                response
              })
            )
            log.debug(`Created form response ${formResponseID}`, { id })
          }
        }
      })
    }
  }
}
