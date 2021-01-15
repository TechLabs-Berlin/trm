const gql = require('graphql-tag')

exports.typeDefs = gql`
  type EdyoucatedTeam {
    id: String
    name: String
    members: [EdyoucatedUser]
  }
  type EdyoucatedUser {
    id: String
    name: String
    avatar_url: String
  }
  type EdyoucatedActivity {
    id: String
    value: Int
  }
  type Query {
    edyoucated_teams: [EdyoucatedTeam]
    edyoucated_teams_by_pk(id: String): EdyoucatedTeam
    edyoucated_activity(userIDs: [String]): [EdyoucatedActivity]
  }
`
