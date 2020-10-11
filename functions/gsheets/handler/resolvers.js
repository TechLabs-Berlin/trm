const { AuthenticationError } = require('apollo-server')

const mustBeAuthorized = ({ jwt, req }) => {
  if(!req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')) {
    throw new AuthenticationError('Authorization required')
  }
  const token = req.headers.authorization.slice(7) // remove 'Bearer '
  try {
    jwt.verify(token)
  } catch(err) {
    throw new AuthenticationError('Token invalid')
  }
}

exports.resolvers = {
  Query: {
    gsheet_content: async (_, { folderID, name, sheetName }, { req, google, jwt, log }) => {
      mustBeAuthorized({ jwt, req })

      log.info(`gsheet_content: getting document '${name}' sheet '${sheetName}' in folder '${folderID}'`)
      const content = await google.getSheetContent({
        folderID,
        name,
        sheetName
      })
      return JSON.stringify(content)
    }
  },
  Mutation: {
    update_gsheet_content: async (_, { folderID, name, sheetName, contentJSON }, { req, google, jwt, log }) => {
      mustBeAuthorized({ jwt, req })

      log.info(`gsheet_content: updating document '${name}' sheet '${sheetName}' in folder '${folderID}'`)
      const content = JSON.parse(contentJSON)
      await google.setSheetContent({
        folderID,
        name,
        sheetName,
        content
      })
      return true
    }
  }
}
