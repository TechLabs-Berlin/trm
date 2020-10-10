const moment = require('moment')

module.exports = ({buildTRMAPI, log}) => {
  return {
    handle: async () => {
      const trmAPI = await buildTRMAPI
      const now = moment()
      const in8Hours = moment().add(8, 'hours')
      const in16Hours = moment().add(16, 'hours')

      log.info('Getting techies without edyoucated user ID')
      const techiesWithoutEdyoucatedUserID = await trmAPI.getTechiesWithoutEdyoucatedUserID()
      log.info(`Found ${techiesWithoutEdyoucatedUserID.length} techies`)
      log.debug('Found techies for update', { techiesWithoutEdyoucatedUserID })

      const edyoucatedUsers = await trmAPI.getEdyoucatedUsers({
        usernames: techiesWithoutEdyoucatedUserID.map(t => t.edyoucated_handle)
      })
      log.info(`Found ${edyoucatedUsers.length} edyoucated users`)
      log.debug(`Found edyoucated users`, { edyoucatedUsers })
      for(const user of edyoucatedUsers) {
        const techie = techiesWithoutEdyoucatedUserID.find(t => t.edyoucated_handle === user.username)
        if(!techie) {
          log.warning(`Expected to find user ${user.username} in techies but didn't, ignoring`, { user })
          continue
        }
        await trmAPI.updateTechieEdyoucatedUserID({
          id: techie.id,
          edyoucatedUserID: user.id,
          edyoucatedNextImportAfter: now.toISOString()
        })
      }
      log.info('Updated all edyoucatedUserIDs')
      const missingTechies = techiesWithoutEdyoucatedUserID.filter(t => !edyoucatedUsers.map(u => u.username).includes(t.edyoucated_handle))
      log.info(`Encountered ${missingTechies.length} missing techies`, { missingTechies })
      for(const techie of missingTechies) {
        await trmAPI.updateTechieEdyoucatedUserID({
          id: techie.id,
          edyoucatedUserID: null,
          edyoucatedNextImportAfter: in16Hours.toISOString()
        })
      }


      log.info('Getting techies pending edyoucated import')
      const techiesPendingEdyoucatedImport = await trmAPI.getTechiesPendingEdyoucatedImport()
      log.info(`Found ${techiesPendingEdyoucatedImport.length} techies`)
      log.debug('Found techies pending import', { techiesPendingEdyoucatedImport })
      if(techiesPendingEdyoucatedImport.length === 0) {
        return
      }
      const edyoucatedUserIDs = techiesPendingEdyoucatedImport.map(t => t.edyoucated_user_id)
      const edyoucatedActivity = await trmAPI.getEdyoucatedActivity({ userIDs: edyoucatedUserIDs })
      for(const activity of edyoucatedActivity) {
        const techie = techiesPendingEdyoucatedImport.find(t => t.edyoucated_user_id === activity.id)
        if(!techie) {
          log.warning(`Expected to find user ${activity.id} in techies but didn't, ignoring`, { activity })
          continue
        }
        await trmAPI.updateTechieActivity({
          techieID: techie.id,
          year: now.toObject().years,
          week: now.week(),
          type: 'edyoucated',
          value: activity.value,
          edyoucatedImportedAt: now.toISOString(),
          edyoucatedNextImportAfter: in8Hours.toISOString()
        })
      }
    }
  }
}
