module.exports = ({ log }) => {
  const determineLocationFromOptions = ( { options }) => {
    if(options.length === 0) {
      return null
    } else if(options.length > 1) {
      // CODEATHOME has priority
      if(options.includes('CODEATHOME')) {
        return 'CODEATHOME'
      }
      const globalIndex = options.indexOf('GLOBAL')
      // if we have GLOBAL _and_ something else, choose something else
      if(globalIndex > -1) {
        return determineLocationFromOptions({ options: options.splice(globalIndex, 1)})
      }
      // guess, and at least pick a persistent option
      return options.sort()[0]
    } else {
      return options[0]
    }
  }

  const DEFAULT_ROLE = 'user'
  const determineRoles = ({ functionalTeam }) => {
    const roles = [DEFAULT_ROLE]
    if(functionalTeam === 'JOURNEY') {
      roles.push('journey')
    } else if(functionalTeam === 'HR') {
      roles.push('hr')
    } else if(functionalTeam === 'BOARD') {
      roles.push('journey')
      roles.push('hr')
    }
    return roles
  }

  const resolveLocation = ({ groupEmails }) => {
    const locations = groupEmails.reduce((acc, group) => {
      const location = journeyTeamGroupsToLocation[group]
      if(location) {
        acc.push(location)
      }
      return acc
    }, [])

    return determineLocationFromOptions({ options: locations })
  }

  return {
    resolveLocation,
    getPayload: ({
      email,
      firstName,
      lastName,
      avatar,
      teamMemberID,
      functionalTeam,
      groupEmails,
    }) => {
      let roles = determineRoles({ functionalTeam })
      let location = resolveLocation({ email, groupEmails })

      log.info(`Authorized ${email} for location ${location}`)

      return {
        location,
        teamMemberID,
        functionalTeam,
        email,
        firstName,
        lastName,
        avatar,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': roles,
          'x-hasura-default-role': DEFAULT_ROLE,
          'x-hasura-location': location,
          'x-hasura-team-member-id': teamMemberID,
        }
      }
    }
  }
}

const journeyTeamGroupsToLocation = {
  'team_aachen@techlabs.org': 'AACHEN',
  'team_barcelona@techlabs.org': 'BARCELONA',
  'team_berlin@techlabs.org': 'BERLIN',
  'team_copenhagen@techlabs.org': 'COPENHAGEN',
  'team_curitiba@techlabs.org': 'CURITIBA',
  'team_dortmund@techlabs.org': 'DORTMUND',
  'team_duesseldorf@techlabs.org': 'DUESSELDORF',
  'team_global@techlabs.org': 'GLOBAL',
  'team_hamburg@techlabs.org': 'HAMBURG',
  'team_medellin@techlabs.org': 'MEDELLIN',
  'team_muenster@techlabs.org': 'MUENSTER',
  'team_munich@techlabs.org': 'MUNICH',
  'team_london@techlabs.org': 'LONDON',
  'team_mannheim@techlabs.org': 'MANNHEIM',
  'team_stockholm@techlabs.org': 'STOCKHOLM',
  'codeathome@techlabs.org': 'CODEATHOME',
}
