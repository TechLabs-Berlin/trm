const querystring = require('querystring')

module.exports = ({fetch, log}) => {
  return {
    getGroups: async ({userKey, accessToken}) => {
      const query = querystring.stringify( { userKey })
      const resp = await fetch(
        `https://www.googleapis.com/admin/directory/v1/groups?${query}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      const result = await resp.json()

      if(!resp.ok) {
        log.debug(`Google API returned an error`, { error: result })
        return Promise.reject({
          reason: `Google API responded with ${resp.status}`,
          error: result
        })
      }

      if(!('groups' in result)) {
        return Promise.reject({
          reason: `Google API returned invalid response, expected to find groups`,
          error: result
        })
      }

      return result.groups.reduce((groups, group) => {
        if(!('email' in group)) {
          return groups
        }

        groups.push(group.email)
        return groups
      }, [])
    },
    getGroupMembers: async ({group, accessToken}) => {
      const resp = await fetch(
        `https://www.googleapis.com/admin/directory/v1/groups/${encodeURIComponent(group)}/members`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      const result = await resp.json()

      if(!resp.ok) {
        log.debug(`Google API returned an error`, { error: result })
        return Promise.reject({
          reason: `Google API responded with ${resp.status}`,
          error: result
        })
      }

      if(!('members' in result)) {
        return Promise.reject({
          reason: `Google API returned invalid response, expected to find members`,
          error: result
        })
      }

      return result.members.reduce((members, member) => {
        if(!('email' in member)) {
          return members
        }

        members.push(member.email)
        return members
      }, [])
    }
  }
}
