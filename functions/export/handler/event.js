const flatten = require('flat')

module.exports = ({buildTRMAPI, trmDataFolderID, log}) => {
  return {
    handle: async () => {
      const trmAPI = await buildTRMAPI
      const now = (new Date()).toISOString()

      log.debug('Getting pending Techie exports')
      const pendingTechieExports = await trmAPI.getTechiePendingExports()
      log.info(`${pendingTechieExports.length} exports are pending`)
      log.debug('Pending Techie exports', { pendingTechieExports })

      for(const { name, type, digest } of pendingTechieExports) {
        if(name !== 'techies') {
          log.warning(`Encountered unexpected export with type ${name}`, { name, type, digest })
          continue
        }
        let sheetName
        let theExport
        let folderID
        if(type === 'anonymous') {
          log.info('Getting anonymous techie export')
          theExport = await trmAPI.getTechieAnonymousExport()
          folderID = trmDataFolderID
          sheetName = 'Techies (anonymous)'
        } else {
          location = await trmAPI.getLocationByName({ name: type })
          if(!location) {
            log.warning(`Location ${type} does not exist, ignoring`)
            continue
          }
          if(!location.export_folder_id) {
            log.info(`Location ${type} does not have export_folder_id, ignoring`)
            continue
          }
          theExport = await trmAPI.getTechieExportByLocation({ name: type })
          folderID = location.export_folder_id
          sheetName = `Techies (${location.value})`
        }
        log.info(`Storing export ${name} with type ${type} in ${folderID}`)
        await trmAPI.updateGSheetContent({
          sheetName: 'Techies',
          content: theExport.map(l => flatten(l)),
          name: sheetName,
          folderID,
        })
        log.info(`Updating export ${name} with type ${type} to digest ${digest}`)
        await trmAPI.updateExport({
          exportedAt: now,
          name,
          type,
          digest,
        })
      }


      log.debug('Getting pending Techie activity exports')
      const pendingTechieSemesterActivityExports = await trmAPI.getTechieSemesterActivityPendingExports()
      log.info(`${pendingTechieSemesterActivityExports.length} exports are pending`)
      log.debug('Pending Techie semester activity exports', { pendingTechieSemesterActivityExports })

      for(const { name, type, digest } of pendingTechieSemesterActivityExports) {
        if(name !== 'techie_semester_activity') {
          log.warning(`Encountered unexpected export with type ${name}`, { name, type, digest })
          continue
        }
        const semester = await trmAPI.getSemesterByID({ semesterID: type })
        if(!semester || !semester.locationByLocation || !semester.locationByLocation.export_folder_id) {
          log.info(`Semester ${type} does not have export_folder_id, ignoring`, { semester })
          continue
        }
        const folderID = semester.locationByLocation.export_folder_id
        const theExport = await trmAPI.getTechieActivityReportsForSemester({ semesterID: semester.id })
        log.info(`Storing export ${name} with semester ${type} in ${folderID}`)
        await trmAPI.updateGSheetContent({
          name: `Techie Activity in ${semester.description}`,
          sheetName: 'Activity',
          content: theExport.map(l => flatten(l)),
          folderID,
        })
        log.info(`Updating export ${name} with type ${type} to digest ${digest}`)
        await trmAPI.updateExport({
          name,
          type,
          digest,
          exportedAt: now,
        })
      }
    }
  }
}
