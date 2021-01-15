require('cross-fetch/polyfill')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const { AUTH_TYPE } = require('aws-appsync/lib/client')
const AWSAppSyncClient = require('aws-appsync').default
const gql = require('graphql-tag')
var groupBy = require('lodash/groupBy')
const NodeCache = require('node-cache')

const GET_ORGANIZATION = gql`
  query GetOrganization($id: ID!) {
    getOrganization(id: $id) {
      teams {
        items {
          id
          name
          members {
            items {
              id
              user {
                id
                name
                picture
              }
            }
          }
        }
      }
    }
  }
`

const LIST_TRACK_PROGRESS = gql`
  query($filter: ModelTrackProgressFilterInput, $nextToken: String) {
    listTrackProgresss(limit: 1000, filter: $filter, nextToken: $nextToken) {
      items {
        user
        duration_finished
      }
      nextToken
    }
  }
`

const login = ({ username, password, userPoolID, clientID }) => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: password,
    })
    var userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: userPoolID,
      ClientId: clientID,
    })
    var userData = {
      Username: username,
      Pool: userPool,
    }
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH')
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        resolve(result.getIdToken().getJwtToken())
      },
      onFailure: function(err) {
        reject(err)
      }
    })
  })
}

const buildClient = async ({ token, apiURL, awsRegion }) => {
  const client = new AWSAppSyncClient({
    url: apiURL,
    region: awsRegion,
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: () => token,
    },
    disableOffline: true
  })
  return client.hydrated()
}

const MINUTE = 60

module.exports = ({ username, password, userPoolID, clientID, awsRegion, apiURL, organizationID, log }) => {
  const cache = new NodeCache({ checkperiod: 0 })

  const buildClientWithCachedToken = async () => {
    let token = cache.get('token')
    if(!token) {
      log.info('Token not cached, logging in')
      token = await login({
        username,
        password,
        userPoolID,
        clientID,
      })
      cache.set('token', token, 60 * MINUTE)
    } else {
      log.info('Using cached token')
    }
    return buildClient({
      token,
      apiURL,
      awsRegion
    })
  }

  return {
    getTeams: async () => {
      log.info('edyoucated API: getTeams')
      const cachedTeams = cache.get('teams')
      if(cachedTeams) {
        log.info('edyoucated API: getTeams returns cached teams')
        return cachedTeams
      }
      log.debug('edyoucated API: getTeams fetches organization')
      const client = await buildClientWithCachedToken()
      const resp = await client.query({
        query: GET_ORGANIZATION,
        variables: { id: organizationID }
      })
      log.debug(`edyoucated API: GET_ORGANIZATION succeeded`)
      const teams = resp.data.getOrganization.teams.items
      cache.set('teams', teams, 10 * MINUTE)
      return teams
    },
    getTrackProgress: async({ userIDs }) => {
      log.info('edyoucated API: getTrackProgress', { userIDs })
      const client = await buildClientWithCachedToken()
      let nextToken = null
      let progress = []
      do {
        const resp = await client.query({
          query: LIST_TRACK_PROGRESS,
          variables: {
            nextToken,
            filter: {
              or: userIDs.map(id => ({ user: { eq: id } }))
            }
          }
        })
        log.debug(`edyoucated API: LIST_TRACK_PROGRESS request returned ${resp.data.listTrackProgresss.items} users`)
        nextToken = resp.data.listTrackProgresss.nextToken
        progress = progress.concat(resp.data.listTrackProgresss.items)
      } while(nextToken !== null)
      return Object.entries(groupBy(progress, p => p.user)).reduce((acc, [id, progresses]) => {
        acc[id] = progresses.reduce((acc, p) => acc + p.duration_finished, 0)
        return acc
      }, {})
    }
  }
}
