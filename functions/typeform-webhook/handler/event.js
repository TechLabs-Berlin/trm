const callbackUtil = require('../util/callback')

const tableName = 'forms'

module.exports = ({typeform, hasura, callbackURL, log}) => {
  return {
    // see https://hasura.io/docs/1.0/graphql/core/event-triggers/payload.html
    handleEvent: async (payload) => {
      const { id } = payload

      log.info(`Received event ${id}`, { id })
      log.debug(`Event details`, { id, payload })

      if(payload.table.name !== tableName) {
        log.info(`Event doesn't belong to ${tableName}, ignoring`, { id })
        return Promise.reject(`Event doesn't belong to ${tableName}`)
      }

      const newState = payload.event.data.new
      const typeformToken = await hasura.getTypeformToken({ location: newState.location })
      const webhookCallbackURL = callbackUtil.createFullCallbackURL({
        formID: newState.id,
        callbackURL
      })
      let needsUpdate = false

      if(!newState.webhook_installed_at) {
        needsUpdate = true
      }
      if(!needsUpdate) {
        const existingWebhook = await typeform.checkWebhook({
          typeformID: newState.form_id,
          typeformToken
        })
        if(!existingWebhook.installed) {
          needsUpdate = true
        } else if(existingWebhook.url !== webhookCallbackURL) {
          needsUpdate = true
        }
      }

      if(!needsUpdate) {
        log.info('Webhook doesn\'t need update', { id })
        return
      }

      log.info('Updating webhook', { id })
      await typeform.updateWebhook({
        typeformID: newState.form_id,
        callbackURL: webhookCallbackURL,
        secret: newState.secret,
        typeformToken
      })
      log.info('Updated webhook', { id })

      log.info('Setting webhookInstalledAt', { id, formID: newState.id })
      await hasura.setWebhookInstalledAt({ formID: newState.id })
      log.info('Setting webhookInstalledAt complete', { id, formID: newState.id })
    }
  }
}
