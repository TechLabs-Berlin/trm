const crypto = require('crypto')
const newGoogleStore = require('./store/google')
const log = require('./util/logger')({
  debugLoggingEnabled: true
})
const fetch = require('./util/fetch')({
  log
})
const google = newGoogleStore({
  fetch,
  log
})

// Get Access Token from https://developers.google.com/admin-sdk/directory/v1/reference/members/list
const accessToken = 'ya29.a0AfH6SMB3IbQ3EgCFb8ceGPSM8kuTUxbO_L-vNmidmRkNDnGa_vGD27NpxjjJR-DWsxKV5OqYuVTbkVYU45R74r7qUNWRr5HDAgmgYbRtkuA7Fl33V1M8qDLIRTWe-6fwYK_NtNJYm2EJkG59T170Pmuq3LYcwyPyaYT-oRvN'
const groups = {
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
const memberPromises = Object.entries(groups).map(group => {
  return google.getGroupMembers({group: group[0],accessToken}).
    then(members => [group[1], members])
})
Promise.all(memberPromises)
  .then(members => {
    return members.reduce((result, group) => {
      const hashedMembers = group[1].map(m => crypto.createHash('sha256').update(m).digest('hex'))
      result[group[0]] = hashedMembers
      return result
    }, {})
  })
  .then(result => Object.entries(result))
  .then(result => result.reduce((users, location) => {
    location[1].forEach(member => users[member] = location[0])
    return users
  }, {}))
  .then(result => console.log(JSON.stringify(result)))
