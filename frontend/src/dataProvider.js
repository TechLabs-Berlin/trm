import ApolloClient from 'apollo-boost'
import buildDataProvider, { buildFields } from 'ra-data-hasura-graphql/src'
import * as gqlTypes from 'graphql-ast-types-browser'
import {
  min,
  max,
  groupBy,
  uniq,
  range,
  sortBy,
  reverse,
  property
} from 'lodash'

import config from './config'
import { getRoles } from './authProvider'

const hasToken = () => localStorage.getItem('token') !== null

export const buildClient = ({ role }) => {
  const token = localStorage.getItem('token')
  return new ApolloClient({
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Hasura-Role': role,
    },
    uri: config.graphqlApiURL,
  })
}

const buildProvider = ({ role }) => {
  const client = buildClient({ role })
  const buildFieldsCustom = (type, _fetchType) => {
    let fields = buildFields(type)
    if(type.name === 'form_responses') {
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
    } else if(type.name === 'techie_activity') {
      fields.push(
        gqlTypes.field(
            gqlTypes.name('techie'),
            null,
            null,
            null,
            gqlTypes.selectionSet([
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

const techieActivityReportProvider = async (hasuraProvider, action, resource, params) => {
  // const { page, perPage } = params.pagination
  const { field, order } = params.sort
  const { semester_id, primary_type } = params.filter
  if(!semester_id || !primary_type) {
    return {
      data: [],
      total: 0,
    }
  }

  const activity = await hasuraProvider('GET_LIST', 'techie_activity', { filter: { semester_id } })
  const semesterWeekMin = min(activity.data.map(a => a.semester_week))
  const semesterWeekMax = max(activity.data.map(a => a.semester_week))
  const weeks = range(semesterWeekMin, semesterWeekMax + 1, 1).map(w => ({n: w, label: `W${w+1}`}))
  const types = uniq(activity.data.map(a => a.type))
  const activityPerTechie = groupBy(activity.data, a => a.techie_id)
  const formattedActivity = Object.entries(activityPerTechie).reduce((acc, [techieID, activity]) => {
    const activityBase = {
      id: techieID,
      last_name: activity[0].techie.last_name,
      weeks: weeks.map(w => w.label),
    }
    for(const { n, label } of weeks) {
      const weekBase = {}
      for(const type of types) {
        const thisActivity = activity.find(a => a.semester_week === n && a.type === type)
        weekBase[type] = thisActivity ? thisActivity.value : null
      }
      activityBase[label] = weekBase
    }
    acc.push(activityBase)
    return acc
  }, [])

  let data = formattedActivity

  if(field === 'id') {
    data = sortBy(data, techie => techie.last_name)
  } else {
    data = sortBy(data, techie => property(field)(techie))
  }
  if(order === 'DESC') {
    data = reverse(data)
  }

  return {
    data,
    total: Object.entries(formattedActivity).length,
  }
}

const multiRoleProvider = async ({ roles }) => {
  const providers = {}
  for(const role of roles) {
    providers[role] = await buildProvider({ role })
  }
  return (action, resource, params) => {
    if(['techies', 'forms', 'form_responses', 'semesters', 'techie_activity', 'projects', 'project_team_members'].includes(resource)) {
      if('journey' in providers) {
        return providers.journey(action, resource, params)
      }
    } else if(['team_members'].includes(resource)) {
      if('hr' in providers) {
        return providers.hr(action, resource, params)
      }
    }
    return providers.user(action, resource, params)
  }
}

const factory = async (action, resource, params) => {
  if (!hasToken()) {
    return Promise.reject('not logged in')
  }
  const roles = getRoles()
  let hasuraProvider = await multiRoleProvider({ roles })
  let dataProvider = hasuraProvider
  if(resource === 'techie_activity_report') {
    dataProvider = (action, resource, params) => techieActivityReportProvider(hasuraProvider, action, resource, params)
  }
  const response = await dataProvider(action, resource, params)
  if(['GET_ONE', 'GET_MANY', 'GET_LIST'].includes(action)) {
    const validUntil = new Date()
    validUntil.setTime(validUntil.getTime() + 5 * 60 * 1000) // cache 5 minutes
    response.validUntil = validUntil
  }
  return response
}

export default factory
