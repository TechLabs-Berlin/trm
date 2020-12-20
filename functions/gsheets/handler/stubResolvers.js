const { mustBeAuthorized } = require('./auth')

exports.resolvers = {
  Query: {
    gsheet_content: async (_, _2, { req, jwt }) => {
      mustBeAuthorized({ jwt, req })
      return JSON.stringify([
        ['A1', 'B1', 'C1'],
        ['A2', 'B2', 'C2']
      ])
    },
  },
  Mutation: {
    update_gsheet_content: async (_, _2, { req, jwt }) => {
      mustBeAuthorized({ jwt, req })
      return true
    }
  }
}
