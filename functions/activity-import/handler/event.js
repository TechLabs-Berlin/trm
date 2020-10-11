const moment = require('moment')

module.exports = ({buildTRMAPI, trmDataFolderID, log}) => {
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


      log.info('Getting pending Slack activity import')
      const sheetOpts = {
        folderID: trmDataFolderID,
        name: 'Slack Activity',
        sheetName: 'Pending Import'
      }
      const slackActivity = await trmAPI.getGSheetContent(sheetOpts)
      log.info(`Found ${slackActivity.length} new records`)
      log.debug(`Found new records`, { records: slackActivity })
      const slackMemberIDs = slackActivity.map(s => s['User ID']).filter(Boolean) // removes falsy elements
      log.debug(`Found ${slackMemberIDs.length} member IDs`, slackMemberIDs)
      const techiesWithSlackMemberID = await trmAPI.getTechiesWithSlackMemberIDs({ slackMemberIDs })
      const missingSlackMemberIDs = slackMemberIDs.filter(m => !techiesWithSlackMemberID.map(t => t.slack_member_id).includes(m))
      if(missingSlackMemberIDs.length > 0) {
        log.info(`Found ${missingSlackMemberIDs.length} missing/wrong Slack Member IDs`, { missingSlackMemberIDs })
      }
      for(const techie of techiesWithSlackMemberID) {
        const activity = slackActivity.find(s => s['User ID'] === techie.slack_member_id)
        if(!activity) {
          log.warning(`Expected to find activity for techie ${techie.id} with slack_member_id ${techie.slack_member_id} but didn't, ignoring`)
          continue
        }
        if('Days active' in activity) {
          let value = 0
          try {
            value = parseInt(activity['Days active'])
          } catch(err) {
            log.error(`Error parsing activity 'Days active' as integer: ${err}`, { activity })
          }
          if(value > 10) {
            value = 1
          } else {
            value = 0
          }

          await trmAPI.updateTechieActivity({
            techieID: techie.id,
            year: now.toObject().years,
            week: now.week(),
            type: 'slack_activity',
            edyoucatedImportedAt: now.toISOString(),
            edyoucatedNextImportAfter: in8Hours.toISOString(),
            value,
          })
        }
        if('Messages posted' in activity) {
          let value = 0
          try {
            value = parseInt(activity['Messages posted'])
          } catch(err) {
            log.error(`Error parsing activity 'Messages posted' as integer: ${err}`, { activity })
          }
          if(value > 10) {
            value = 1
          } else {
            value = 0
          }

          await trmAPI.updateTechieActivity({
            techieID: techie.id,
            year: now.toObject().years,
            week: now.week(),
            type: 'slack_participation',
            edyoucatedImportedAt: now.toISOString(),
            edyoucatedNextImportAfter: in8Hours.toISOString(),
            value,
          })
        }
      }
      await trmAPI.updateGSheetContent({
        content: [],
        ...sheetOpts
      })
    }
  }
}
