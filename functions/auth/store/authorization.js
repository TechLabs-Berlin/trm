module.exports = ({ log }) => {
  const resolveLocation = ({ groupEmails }) => {
    const locations = groupEmails.reduce((acc, group) => {
      const location = mgmtTeamGroupsToLocation[group]
      if(location) {
        acc.push(location)
      }
      return acc
    }, [])

    if(locations.length === 0) {
      return undefined
    } else if(locations.length > 1) {
      log.warning(`User ${userKey} is assigned to more than one location (${JSON.stringify(locations)}), choosing the first one`)
      return locations.sort()[0]
    } else {
      return locations[0]
    }
  }

  return {
    getPayload: ({
      email,
      firstName,
      lastName,
      avatar,
      groupEmails,
    }) => {
      let roles = ['user']
      let defaultRole = 'user'

      let location = resolveLocation({ groupEmails })
      if (!location) {
        location = 'PLAYGROUND'
      }

      log.info(`Authorized ${email} for location ${location}`)

      return {
        email,
        firstName,
        lastName,
        avatar,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': roles,
          'x-hasura-default-role': defaultRole,
          'x-hasura-location': location
        }
      }
    }
  }
}

const mgmtTeamGroupsToLocation = {
  'team_aachen@techlabs.org': 'AACHEN',
  'team_barcelona@techlabs.org': 'BARCELONA',
  'team_berlin@techlabs.org': 'BERLIN',
  'team_copenhagen@techlabs.org': 'COPENHAGEN',
  'team_curitiba@techlabs.org': 'CURITIBA',
  'team_dortmund@techlabs.org': 'DORTMUND',
  'team_duesseldorf@techlabs.org': 'DUESSELDORF',
  'team_global@techlabs.org': 'GLOBAL',
  'team_hamburg@techlabs.org': 'HAMBURG',
  'team_mannheim@techlabs.org': 'MANNHEIM',
  'team_medellin@techlabs.org': 'MEDELLIN',
  'team_muenster@techlabs.org': 'MUENSTER',
  'team_munich@techlabs.org': 'MUNICH'
}
