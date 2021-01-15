import ApolloClient from 'apollo-boost'
import buildDataProvider, { buildFields } from 'ra-data-hasura-graphql/src'
import * as gqlTypes from 'graphql-ast-types-browser';

import config from './config'

let hasuraProvider = null

const hasToken = () => localStorage.getItem('token') !== null

export const buildClient = () => {
  const token = localStorage.getItem('token')
  return new ApolloClient({
    headers: {
      'Authorization': `Bearer ${token}`
    },
    uri: config.graphqlApiURL,
  })
}

const buildProvider = () => {
  const client = buildClient()
  const buildFieldsCustom = (type, _fetchType) => {
    let fields = buildFields(type)
    debugger
    if (type.name === 'form_responses') {
        // here we add additional fields we want to query for apps.
        // we are using the graphql-ast-types functions which is ast representation for graphql
        fields.push(
            gqlTypes.field(
                gqlTypes.name('form'),
                null,
                null,
                null,
                gqlTypes.selectionSet([
                    gqlTypes.field(gqlTypes.name('form_type')),
                    gqlTypes.field(gqlTypes.name('description')),
                ])
            )
        )
        fields.push(
          gqlTypes.field(
              gqlTypes.name('techie'),
              null,
              null,
              null,
              gqlTypes.selectionSet([
                  gqlTypes.field(gqlTypes.name('id')),
                  gqlTypes.field(gqlTypes.name('first_name')),
                  gqlTypes.field(gqlTypes.name('last_name')),
              ])
          )
      )
    }
    return fields
  };
  return buildDataProvider({
    client,
  }, {
    buildFields: buildFieldsCustom
  })
}

export default async (...args) => {
  if (hasuraProvider === null && hasToken()) {
    hasuraProvider = await buildProvider()
  }
  if (hasuraProvider !== null) {
    return hasuraProvider(...args)
  }
  return Promise.reject('not logged in')
}
