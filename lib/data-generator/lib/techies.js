const faker = require('faker')
const moment = require('moment')

module.exports = async ({ n, semester, location, log, buildTRMAPI }) => {
  const trmAPI = await buildTRMAPI
  const states = ['APPLICANT', 'REJECTED', 'LEARNER', 'ALUMNI']
  const genders = ['male', 'female']
  const tracks = ['DS', 'AI', 'WEBDEV', 'UX']
  const now = moment()
  const in8Hours = moment().add(8, 'hours')
  const techies = []
  for(let i = 0; i < n; i++) {
    const state = faker.random.arrayElement(states)
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const techie = {
      email: faker.internet.email(firstName, lastName),
      gender: faker.random.arrayElement(genders),
      age: faker.random.number({min: 20, max: 35}),
      techieKey: faker.internet.userName(),
      semesterID: semester,
      applicationTrackChoice: faker.random.arrayElement(tracks),
      location,
      firstName,
      lastName,
      state,
    }
    if(state === 'LEARNER') {
      techie.googleAccount = techie.email
      techie.githubHandle = faker.internet.userName(firstName, lastName)
      techie.linkedinProfileURL = `https://linkedin.com/${faker.internet.userName(firstName, lastName)}`
      techie.slackMemberID = faker.internet.password()
      techie.track = techie.applicationTrackChoice
    }
    techies.push(techie)
  }
  for(const techie of techies) {
    log.info(`Create techie ${techie.email}`)
    const resp = await trmAPI.custom({
      query: `
        mutation(
          $location: locations_enum!,
          $semesterID: uuid!,
          $state: techie_lifecycle_states_enum!,
          $techieKey: String!,
          $email: String,
          $firstName: String,
          $lastName: String,
          $applicationTrackChoice: tracks_enum,
          $track: tracks_enum,
          $gender: String,
          $age: smallint,
          $googleAccount: String,
          $githubHandle: String,
          $linkedinProfileURL: String,
          $slackMemberID: String,
        ) {
          insert_techies_one(object: {
            location: $location,
            semester_id: $semesterID,
            state: $state,
            techie_key: $techieKey,
            email: $email,
            first_name: $firstName,
            last_name: $lastName,
            application_track_choice: $applicationTrackChoice,
            track: $track,
            gender: $gender,
            age: $age,
            google_account: $googleAccount,
            github_handle: $githubHandle,
            linkedin_profile_url: $linkedinProfileURL,
            slack_member_id: $slackMemberID
          }) {
            id
          }
        }
      `,
      variables: techie
    })
    const id = resp.insert_techies_one.id
    if(techie.state === 'LEARNER') {
      log.info(`Create activity for techie ${id}`)
      for(const week of [0, 1, 2, 3, 4]) {
        await trmAPI.updateTechieActivity({
          techieID: id,
          semesterID: techie.semesterID,
          semesterWeek: week,
          type: 'edyoucated',
          value: faker.random.number({min: 0, max: 50 * 60}),
          edyoucatedImportedAt: now.toISOString(),
          edyoucatedNextImportAfter: in8Hours.toISOString(),
        })
      }
    }
  }
}
