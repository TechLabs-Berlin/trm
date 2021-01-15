const _ = require('lodash')
const moment = require('moment')
const strconv = require('../util/strconv')

module.exports = ({buildTRMAPI, trmDataFolderID, log}) => {
  return {
    handle: async () => {
      const trmAPI = await buildTRMAPI
      const now = moment()
      const in8Hours = moment().add(8, 'hours')
      const in16Hours = moment().add(16, 'hours')

      log.info('Getting techies without edyoucated user ID')

      // returns an array of techies with id, first_name, last_name, semester.id and semester.edyoucated_team_id
      const techiesWithoutEdyoucatedUserID = await trmAPI.getTechiesWithoutEdyoucatedUserID()
      log.info(`Found ${techiesWithoutEdyoucatedUserID.length} techies`)
      log.debug('Found techies for update', { techiesWithoutEdyoucatedUserID })

      // groups those techies in an object by semester id because we'll later find the members of the edyoucated team to match the names
      const techiesBySemesterID = _.groupBy(techiesWithoutEdyoucatedUserID, t => t.semester.id)
      log.debug(`Found techies from ${Object.keys(techiesBySemesterID).length} semesters`, Object.keys(techiesBySemesterID))

      // work work: iterate through semesters, find edyoucated teams, match the names etc
      for(const [semesterID, techies] of Object.entries(techiesBySemesterID)) {
        log.debug(`Working on semester ${semesterID}`)

        // techies[0] is guaranteed to exist otherwise the key would not be there
        // edyoucated_team_id is guaranteed to be non-null as per the query
        const edyoucatedTeamID = techies[0].semester.edyoucated_team_id
        const edyoucatedTeamMembers = await trmAPI.getEdyoucatedTeamMembers({ edyoucatedTeamID })
        const semester = await trmAPI.getSemesterByID({ semesterID })
        const edyoucatedUserIDsInSemester = _.uniq(semester.techies.map(t => t.edyoucated_user_id))
        log.debug(`Found ${edyoucatedTeamMembers.length} edyoucated team members`)
        log.debug(`Found ${edyoucatedUserIDsInSemester.length} edyoucated_user_ids in the same semester`)

        // Prepare stuff we need for processing in loop
        const teamMembersWithCanonicalName = edyoucatedTeamMembers.map(m => ({
          canonical_name: strconv.cleanse(m.name),
          ...m
        }))
        const edyoucatedCanonicalNames = teamMembersWithCanonicalName.map(m => m.canonical_name)
        const updatedTechieIDs = []

        for(const techie of techies) {
          log.debug(`Working on ${techie.id}`)

          // canonicalize the name and get a best guess, discard if it is too bad
          const ourCanonicalName = strconv.cleanse(`${techie.first_name} ${techie.last_name}`)
          const bestGuess = strconv.findBestMatch(ourCanonicalName, edyoucatedCanonicalNames)
          if(bestGuess.rating < 0.8) {
            log.debug(`canonical_name: ${ourCanonicalName} with best guess ${bestGuess.target} had too low rating of ${bestGuess.rating}, ignoring...`)
            continue
          }

          // yay we can use the best guess
          const bestGuessMember = teamMembersWithCanonicalName.find(m => m.canonical_name === bestGuess.target)
          // not finding them can not happen technically, but check anyway
          if(!bestGuessMember) {
            log.warn(`expected to find ${bestGuess.target} in edyoucated members, but didn't, ignoring...`)
            continue
          }

          if(edyoucatedUserIDsInSemester.includes(bestGuessMember.id)) {
            log.warn(`edyoucated user id ${bestGuessMember.id} for ${bestGuessMember.name} is already in use for semester ${semesterID}, ignoring...`)
            continue
          }

          log.info(`Found ${bestGuessMember.canonical_name} as best guess for ${ourCanonicalName} with id ${bestGuessMember.id}`)
          log.info(`Updating ${techie.id} for edyoucated user id ${bestGuessMember.id}`)
          await trmAPI.updateTechieEdyoucatedUserID({
            id: techie.id,
            edyoucatedUserID: bestGuessMember.id,
            edyoucatedNextImportAfter: now.toISOString()
          })
          updatedTechieIDs.push(techie.id)
        }

        // Postpone missing techies to be updated in 16 hours
        const missingTechies = techies.filter(t => !updatedTechieIDs.includes(t.id))
        log.info(`Found ${missingTechies.length} techie which could not be assigned, postponing them...`, { missingTechies })
        for (const techie of missingTechies) {
          await trmAPI.updateTechieEdyoucatedUserID({
            id: techie.id,
            edyoucatedUserID: null,
            edyoucatedNextImportAfter: in16Hours.toISOString()
          })
        }
      }


      log.info('Getting techies pending edyoucated import')
      const techiesPendingEdyoucatedImport = await trmAPI.getTechiesPendingEdyoucatedImport()
      log.info(`Found ${techiesPendingEdyoucatedImport.length} techies`)
      log.debug('Found techies pending import', { techiesPendingEdyoucatedImport })
      if(techiesPendingEdyoucatedImport.length > 0) {
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
