const faker = require('faker')

module.exports = {
  generateTechieKey: () => {
    return faker.internet.userName()
  }
}
