const gql = require('graphql-tag')

exports.typeDefs = gql`
  type EdyoucatedUser {
    id: String
    username: String
    avatar_url: String
  }
  type EdyoucatedActivity {
    id: String
    value: Int
  }
  type Query {
    edyoucated_users(usernames: [String]): [EdyoucatedUser]
    edyoucated_activity(userIDs: [String]): [EdyoucatedActivity]
  }
`
