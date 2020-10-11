module.exports = () => {
  if(!('JWT_KEY' in process.env)) {
    throw new Error('JWT_KEY is unset')
  }
  const jwtKey = process.env.JWT_KEY

  if(!('GRAPHQL_URL' in process.env)) {
    throw new Error('GRAPHQL_URL is unset')
  }
  const graphqlURL = process.env.GRAPHQL_URL

  if(!('TRM_DATA_FOLDER_ID' in process.env)) {
    throw new Error('TRM_DATA_FOLDER_ID is unset')
  }
  const trmDataFolderID = process.env.TRM_DATA_FOLDER_ID

  let debug = false
  if('DEBUG' in process.env) {
    debug = true
  }

  return {
    jwtKey,
    graphqlURL,
    trmDataFolderID,
    debug
  }
}
