require('cross-fetch/polyfill')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const AWS = require('aws-sdk')
const { AUTH_TYPE } = require('aws-appsync/lib/client')
const AWSAppSyncClient = require('aws-appsync').default
const gql = require('graphql-tag')
var groupBy = require('lodash/groupBy')
const NodeCache = require('node-cache')

const LIST_USERS = gql`
  query($nextToken: String) {
    listUsers(limit: 1000, nextToken: $nextToken) {
      items {
        id
        username
        picture
      }
      nextToken
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

const login = ({ username, password, userPoolID, identityPoolID, clientID, awsRegion }) => {
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

module.exports = ({ username, password, userPoolID, identityPoolID, clientID, awsRegion, apiURL, log }) => {
  const cache = new NodeCache({ checkperiod: 0 })

  const buildClientWithCachedToken = async () => {
    let token = cache.get('token')
    if(!token) {
      log.info('Token not cached, logging in')
      token = await login({
        username,
        password,
        userPoolID,
        identityPoolID,
        clientID,
        awsRegion
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
    getAllUsers: async () => {
      log.info('edyoucated API: getAllUsers')
      const cachedUsers = cache.get('allUsers')
      if(cachedUsers) {
        log.info('edyoucated API: getAllUsers returns cached users')
        return cachedUsers
      }
      log.debug('edyoucated API: getAllUsers fetches all users')
      const client = await buildClientWithCachedToken()
      let nextToken = null
      let allUsers = []
      do {
        const resp = await client.query({
          query: LIST_USERS,
          variables: { nextToken }
        })
        log.debug(`edyoucated API: LIST_USERS request returned ${resp.data.listUsers.items.length} users`)
        nextToken = resp.data.listUsers.nextToken
        allUsers = allUsers.concat(resp.data.listUsers.items)
      } while(nextToken !== null)
      cache.set('allUsers', allUsers, 10 * MINUTE)
      return allUsers
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
