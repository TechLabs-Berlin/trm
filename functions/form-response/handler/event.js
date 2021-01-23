const _ = require('lodash')

const generator = require('../util/generator')
const techieutil = require('../util/techie')

const tableName = 'form_responses'

module.exports = ({buildTRMAPI, log}) => {
  return {
    handle: async ({payload}) => {
      const trmAPI = await buildTRMAPI
      const { id } = payload

      log.info(`Received event ${id}`, { id })
      log.debug(`Event details`, { id, payload })

      if(payload.table.name !== tableName) {
        log.info(`Event doesn't belong to ${tableName}, ignoring`, { id })
        return Promise.reject(`Event doesn't belong to ${tableName}`)
      }

      const newState = payload.event.data.new
      const form = await trmAPI.getForm({ id: newState.form_id })

      let techie = null
      if(newState.techie_id) {
        log.info('Looking up techie by id', { id })
        const result = await trmAPI.findTechieByID({
          id: newState.techie_id
        })
        if(result.found) {
          techie = result.techie
        }
      }
      if(!techie && ('email' in newState.answers)) {
        log.info('Looking up techie by email', { id })
        const result = await trmAPI.findTechieByEmail({
          location: form.location,
          semesterID: form.semester_id,
          email: newState.answers.email.value
        })
        if(result.found) {
          techie = result.techie
        }
      }
      if(!techie && ('techie_key' in newState.answers)) {
        log.info('Looking up techie by techie_key', { id })
        const result = await trmAPI.findTechieByTechieKey({
          location: form.location,
          semesterID: form.semester_id,
          techieKey: newState.answers.techie_key.value
        })
        if(result.found) {
          techie = result.techie
        }
      }
      if(!techie && form.form_type === 'APPLICATION') {
        log.info('Creating techie', { id })
        const candidateKeys = _.times(10, () => generator.generateTechieKey({ location: form.location }))
        const usedKeys = await trmAPI.getUsedTechieKeys({ techieKeys: candidateKeys })
        const unusedKeys = _.difference(candidateKeys, usedKeys)
        if(unusedKeys.length === 0) {
          log.error('Error generating an unused Techie Key, all 10 keys are in-use', { candidateKeys, usedKeys })
          return
        }
        techie = await trmAPI.createTechie({
          location: form.location,
          semesterID: form.semester_id,
          state: 'APPLICANT',
          techieKey: unusedKeys[0],
        })
      }

      if(techie) {
        log.info(`Processing techie ${techie.id}`, { id })
        await trmAPI.associateTechieWithFormResponse({
          formResponseID: newState.id,
          techieID: techie.id
        })
        log.debug(`Associated techie ${techie.id} with form response ${newState.id}`, { id })
        const updatedTechieMasterData = techieutil.processTechieMasterData({
          attributes: techie,
          formAnswers: newState.answers
        })
        await trmAPI.updateTechieMasterData(updatedTechieMasterData)
        log.debug(`Updated techie master data`, { masterData: updatedTechieMasterData, id })
        return
      }

      log.info('Techie not found, not updated', { id })
    }
  }
}
