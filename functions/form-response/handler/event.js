const generator = require('../util/generator')
const techieutil = require('../util/techie')

const tableName = 'form_responses'

module.exports = ({hasura, log}) => {
  return {
    handle: async ({payload}) => {
      const { id } = payload

      log.info(`Received event ${id}`, { id })
      log.debug(`Event details`, { id, payload })

      if(payload.table.name !== tableName) {
        log.info(`Event doesn't belong to ${tableName}, ignoring`, { id })
        return Promise.reject(`Event doesn't belong to ${tableName}`)
      }

      const newState = payload.event.data.new
      const form = await hasura.getForm({ id: newState.form_id })

      let techie = null
      if(newState.techie_id) {
        log.info('Looking up techie by id', { id })
        const result = await hasura.findTechieByID({
          id: newState.techie_id
        })
        if(result.found) {
          techie = result.techie
        }
      }
      if(!techie && ('email' in newState.answers)) {
        log.info('Looking up techie by email', { id })
        const result = await hasura.findTechieByEmail({
          location: form.location,
          semester: form.semester,
          email: newState.answers.email.value
        })
        if(result.found) {
          techie = result.techie
        }
      }
      if(!techie && ('techie_key' in newState.answers)) {
        log.info('Looking up techie by techie_key', { id })
        const result = await hasura.findTechieByTechieKey({
          location: form.location,
          semester: form.semester,
          techieKey: newState.answers.techie_key.value
        })
        if(result.found) {
          techie = result.techie
        }
      }
      if(!techie && form.imports_techies) {
        log.info('Creating techie', { id })
        techie = await hasura.createTechie({
          location: form.location,
          semesterID: form.semester_id,
          state: 'APPLICANT',
          techieKey: generator.generateTechieKey()
        })
      }

      if(techie) {
        log.info(`Processing techie ${techie.id}`, { id })
        await hasura.associateTechieWithFormResponse({
          formResponseID: newState.id,
          techieID: techie.id
        })
        log.debug(`Associated techie ${techie.id} with form response ${newState.id}`, { id })
        const updatedTechieMasterData = techieutil.processTechieMasterData({
          attributes: techie,
          formAnswers: newState.answers
        })
        await hasura.updateTechieMasterData(updatedTechieMasterData)
        log.debug(`Updated techie master data`, { masterData: updatedTechieMasterData, id })
        return
      }

      log.info('Techie not found, not updated', { id })
    }
  }
}
