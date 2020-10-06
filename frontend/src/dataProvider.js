import ApolloClient from 'apollo-boost'
import buildHasuraProvider from 'ra-data-hasura-graphql/src'
// import buildDataProvider from 'ra-data-hasura-graphql';
import {
  buildQueryFactory
} from 'ra-data-hasura-graphql/src/buildQuery';
import buildVariables from 'ra-data-hasura-graphql/src/buildVariables';
import {
  buildGqlQuery,
  buildFields,
  buildMetaArgs,
  buildArgs,
  buildApolloArgs,
} from 'ra-data-hasura-graphql/src/buildGqlQuery';
import getResponseParser from 'ra-data-hasura-graphql/src/getResponseParser';
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
  const buildFieldsCustom = (type) => {
    let res = buildFields(type);
    if (type.name === 'form_responses') {
        // here we add additional fields we want to query for apps.
        // we are using the graphql-ast-types functions which is ast representation for graphql
        res.push(
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
        );
        res.push(
          gqlTypes.field(
              gqlTypes.name('techie'),
              null,
              null,
              null,
              gqlTypes.selectionSet([
                  gqlTypes.field(gqlTypes.name('first_name')),
                  gqlTypes.field(gqlTypes.name('last_name')),
              ])
          )
      );
    }
    return res;
  };
  const buildGqlQueryCustom = (iR) =>
    buildGqlQuery(
      iR,
      buildFieldsCustom,
      buildMetaArgs,
      buildArgs,
      buildApolloArgs
    );
  const buildQuery = buildQueryFactory(
    buildVariables,
    buildGqlQueryCustom,
    getResponseParser
  );
  return buildHasuraProvider({
    client,
    buildQuery
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
