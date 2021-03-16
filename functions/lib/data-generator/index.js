const config = require('./config')()
const log = require('./util/logger')({
  debugLoggingEnabled: config.debug
})
const fetch = require('./util/fetch')({
  log
})
const jwt = require('./util/jwt')({
  jwtKey: config.jwtKey
})
const buildTRMAPI = require('trm-api')({
  graphqlURL: config.graphqlURL,
  token: jwt.admin(),
  fetch,
  log
})
const generateTechies = require('./lib/techies')
const { Command } = require('commander')

const program = new Command()

const generate = program
  .command('generate')
  .description('Generate fake data')

generate
  .command('techies <n>')
  .description('Generate techies')
  .requiredOption('--semester <uuid>', 'Semester UUID')
  .requiredOption('--location <name>', 'Location')
  .action(async (n, opts) => {
    try {
      await generateTechies({
        semester: opts.semester,
        location: opts.location,
        n,
        buildTRMAPI,
        log
      })
    } catch(e) {
      console.error(e)
      process.exit(1)
    }
  })

generate
  .command('token')
  .requiredOption('--location <name>', 'Location')
  .requiredOption('--team-member-id <id>', 'Team Member ID')
  .requiredOption('--functional-team <name>', 'Functional Team')
  .requiredOption('--roles <names>', 'Roles, comma-separated')
  .description('Generate a JWT')
  .action(opts => {
    console.info(jwt.user({
      location: opts.location,
      teamMemberID: opts.teamMemberId,
      functionalTeam: opts.functionalTeam,
      roles: opts.roles.split(','),
    }))
  })

program.parse(process.argv)
