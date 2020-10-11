const gql = require('graphql-tag')

exports.typeDefs = gql`
  type Query {
    gsheet_content(folderID: String, name: String, sheetName: String): String
  }
  type Mutation {
    update_gsheet_content(folderID: String, name: String, sheetName: String, contentJSON: String): Boolean
  }
`
