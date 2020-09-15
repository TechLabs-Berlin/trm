const groupsToLocations = {
  'team_aachen@techlabs.org': 'AACHEN',
  'team_barcelona@techlabs.org': 'BARCELONA',
  'team_copenhagen@techlabs.org': 'COPENHAGEN',
  'team_medellin@techlabs.org': 'MEDELLIN',
  'team_curitiba@techlabs.org': 'CURITIBA',
  'team_muenster@techlabs.org': 'MUENSTER',
  'team_dortmund@techlabs.org': 'DORTMUND',
  'team_berlin@techlabs.org': 'BERLIN',
  'team_munich@techlabs.org': 'MUNICH',
  'team_hamburg@techlabs.org': 'HAMBURG',
  'team_mannheim@techlabs.org': 'MANNHEIM',
  'team_duesseldorf@techlabs.org': 'DUESSELDORF'
}

const admins = [
  'felix.seidel@techlabs.org',
  'laszlo.kuehl@techlabs.org',
  'christian.hanster@techlabs.org',
  'friedrich.schoene@techlabs.org',
  'nils.bahr@techlabs.org'
]

module.exports = {
  getPayload: ({name, email, groups}) => {
    let roles = ['user']
    let defaultRole = 'user'

    // if(admins.includes(email)) {
    //   roles.push('admin')
    //   defaultRole = 'admin'
    // }

    const locations = groups.reduce((locations, group) => {
      const location = groupsToLocations[group]
      if(!location) {
        return locations
      }
      locations.push(location)
      return locations
    }, [])

    return {
      name,
      email,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': roles,
        'x-hasura-default-role': defaultRole,
        'x-hasura-locations': locations
      }
    }
  }
}
