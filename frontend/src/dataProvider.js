import ApolloClient from 'apollo-boost'
import buildHasuraProvider from 'ra-data-hasura-graphql'

import config from './config'

let hasuraProvider = null

const hasToken = () => localStorage.getItem('token') !== null

const buildProvider = () => {
  const token = localStorage.getItem('token')
  const client = new ApolloClient({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      uri: config.graphqlApiURL,
  })
  return buildHasuraProvider({ client })
}

export default async (...args) => {
  if(hasuraProvider === null && hasToken()) {
    hasuraProvider = await buildProvider()
  }
  if(hasuraProvider !== null) {
    return hasuraProvider(...args)
  }
  return Promise.reject('not logged in')
}
