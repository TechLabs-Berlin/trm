const { google } = require('googleapis')

const a1 = require('../util/a1')

const auth = new google.auth.GoogleAuth({
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets'
  ]
})

const drive = google.drive({
  version: 'v3',
  auth
})

const sheets = google.sheets({
  version: 'v4',
  auth
})

module.exports = ({ log }) => {
  const findFileID = async ({ folderID, name }) => {
    log.debug(`Listing files in folder ${folderID}`)
    // TODO add pagination
    const resp = await drive.files.list({
      q: `'${folderID}' in parents`
    })
    log.debug(`Got ${resp.data.files.length} files in folder ${folderID}`, { files: resp.data.files })
    const file = resp.data.files.find(f => f.name === name)
    if(!file) {
      log.warning(`File ${name} not found in ${folderID}`)
      return Promise.reject(`${name} not found in ${folderID}`)
    }
    if(!file.id) {
      log.warning(`File ${name} doesn't have ID`)
      return Promise.reject(`${name} doesn't have ID`)
    }
    return file.id
  }

  const clearSheetContent = async ({ folderID, name, sheetName }) => {
    const id = await findFileID({ folderID, name })
    await sheets.spreadsheets.values.clear({
      spreadsheetId: id,
      range: sheetName
    })
  }

  return {
    getSheetContent: async ({ folderID, name, sheetName }) => {
      const id = await findFileID({ folderID, name })
      log.info(`Getting sheet ${name} with ID ${id}`)
      const sheetResp = await sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: sheetName
      })
      const values = sheetResp.data.values
      log.debug('Got sheet', { values })
      if(values.length < 2) {
        log.info('Sheet only has one row, can\'t extract data')
        return []
      }
      const keys = values[0]
      return values.slice(1).map(v => {
        return Object.assign(...keys.map((k, i) => ({ [k]: v[i] })))
      })
    },
    setSheetContent: async ({ folderID, name, sheetName, content }) => {
      const id = await findFileID({ folderID, name })
      await clearSheetContent({ folderID, name, sheetName })
      if(content.length < 1) {
        return
      }
      const keys = Object.keys(content[0])
      const values = [keys]
      for(const row of content) {
        values.push(keys.map(k => row[k]))
      }
      const endIndex = `${a1.columnToLetter(keys.length)}${values.length}`
      const range = `${sheetName}!A1:${endIndex}`
      log.info(`Setting sheet content for ${name} with range ${range}`, { values })
      await sheets.spreadsheets.values.update({
        spreadsheetId: id,
        valueInputOption: 'RAW',
        requestBody: {
          majorDimension: 'ROWS',
          values,
          range
        },
        range,
      })
    },
    clearSheetContent
  }
}
