const _ = require('lodash')
const { mustBeAuthorized } = require('./auth')

exports.resolvers = {
  Query: {
    edyoucated_teams: async (_, _2, { req, edyoucated, jwt, log }) => {
      mustBeAuthorized({ jwt, req })

      log.info('edyoucated_teams queried')
      const teams = await edyoucated.getTeams()
      log.info(`edyoucated_teams: found ${teams.length} teams`)
      return teams.map(t => ({
        id: t.id,
        name: t.name,
        members: t.members.items.map(m => ({
          id: m.user.id,
          name: m.user.name,
          avatar_url: m.user.picture
        }))
      }))
    },
    edyoucated_teams_by_pk: async (_, { id }, { req, edyoucated, jwt, log }) => {
      mustBeAuthorized({ jwt, req })

      log.info(`edyoucated_teams_by_pk (id: ${id}) queried`)
      if(!id) {
        log.info('edyoucated_teams_by_pk: no ID queried, returning null')
        return null
      }
      const teams = await edyoucated.getTeams()
      log.info(`edyoucated_teams_by_pk: found ${teams.length} teams`)
      const team = teams.find(t => t.id === id)
      if(!team) {
        log.info('Team not found')
        return null
      }
      return {
        id: team.id,
        name: team.name,
        members: team.members.items.map(m => ({
          id: m.user.id,
          name: m.user.name,
          avatar_url: m.user.picture
        }))
      }
    },
    edyoucated_activity: async (_ignore, { userIDs }, { req, edyoucated, jwt, log }) => {
      mustBeAuthorized({ jwt, req })

      log.info(`edyoucated_activity: finding activity for ${userIDs.length} users`)
      log.debug(`edyoucated_activity: finding activity for userIDs`, { userIDs })
      let results = []
      for(const thisIDs of _.chunk(userIDs, 100)) {
        const activity = await edyoucated.getTrackProgress({
          userIDs: thisIDs,
        })
        log.info(`edyoucated_activity: found activity for ${Object.keys(activity).length} users`)
        log.debug(`edyoucated_activity: found activity for users`, { activity })
        const thisResults = Object.entries(activity).map(([id, value]) => ({
          id,
          value
        }))
        results = results.concat(thisResults)
      }
      return results
    }
  }
}
