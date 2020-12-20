const { mustBeAuthorized } = require('./auth')

exports.resolvers = {
  Query: {
    edyoucated_users: async (_, { usernames }, { req, edyoucated, jwt, log }) => {
      mustBeAuthorized({ jwt, req })

      log.info(`edyoucated_users: finding ${usernames.length} users`)
      log.debug(`edyoucated_users: usernames`, { usernames })
      const allUsers = await edyoucated.getAllUsers()
      log.info(`edyoucated_users: retrieved ${allUsers.length} users`)
      const foundUsers = allUsers.filter(u => usernames.includes(u.username))
                         .map(u => ({
                           id: u.id,
                           username: u.username,
                           avatar_url: u.picture
                         }))
      log.info(`edyoucated_users: found ${foundUsers.length}`)
      log.debug(`edyoucated_users: found users`, { foundUsers })
      return foundUsers
    },
    edyoucated_activity: async (_, { userIDs }, { req, edyoucated, jwt, log }) => {
      mustBeAuthorized({ jwt, req })

      log.info(`edyoucated_activity: finding activity for ${userIDs.length} users`)
      log.debug(`edyoucated_activity: finding activity for userIDs`, { userIDs })
      const activity = await edyoucated.getTrackProgress({
        userIDs
      })
      log.info(`edyoucated_activity: found activity for ${Object.keys(activity).length} users`)
      log.debug(`edyoucated_activity: found activity for users`, { activity })
      return Object.entries(activity).map(([id, value]) => ({
        id,
        value
      }))
    }
  }
}
