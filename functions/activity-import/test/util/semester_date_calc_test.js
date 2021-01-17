const moment = require('moment')
const expect = require('chai').expect
const semesterDateCalc = require('../../util/semester_date_calc')

describe('semester_date_calc', () => {
  describe('calculateSemesterWeeks', () => {
    it('works', () => {
      const semesterStartsAt = moment.utc('2021-01-31T00:00:00', 'YYYY-MM-DD')
      const semesterEndsAt = moment.utc('2021-06-01T00:00:00', 'YYYY-MM-DD')
      const weeks = semesterDateCalc.calculateSemesterWeeks({ semesterStartsAt, semesterEndsAt })
      const stringWeeks = weeks.map(([start, end]) => [start.format(), end.format()])

      expect(stringWeeks).to.eql([
        [ '2021-01-31T00:00:00Z', '2021-01-31T23:59:59Z' ],
        [ '2021-02-01T00:00:00Z', '2021-02-07T23:59:59Z' ],
        [ '2021-02-08T00:00:00Z', '2021-02-14T23:59:59Z' ],
        [ '2021-02-15T00:00:00Z', '2021-02-21T23:59:59Z' ],
        [ '2021-02-22T00:00:00Z', '2021-02-28T23:59:59Z' ],
        [ '2021-03-01T00:00:00Z', '2021-03-07T23:59:59Z' ],
        [ '2021-03-08T00:00:00Z', '2021-03-14T23:59:59Z' ],
        [ '2021-03-15T00:00:00Z', '2021-03-21T23:59:59Z' ],
        [ '2021-03-22T00:00:00Z', '2021-03-28T23:59:59Z' ],
        [ '2021-03-29T00:00:00Z', '2021-04-04T23:59:59Z' ],
        [ '2021-04-05T00:00:00Z', '2021-04-11T23:59:59Z' ],
        [ '2021-04-12T00:00:00Z', '2021-04-18T23:59:59Z' ],
        [ '2021-04-19T00:00:00Z', '2021-04-25T23:59:59Z' ],
        [ '2021-04-26T00:00:00Z', '2021-05-02T23:59:59Z' ],
        [ '2021-05-03T00:00:00Z', '2021-05-09T23:59:59Z' ],
        [ '2021-05-10T00:00:00Z', '2021-05-16T23:59:59Z' ],
        [ '2021-05-17T00:00:00Z', '2021-05-23T23:59:59Z' ],
        [ '2021-05-24T00:00:00Z', '2021-05-30T23:59:59Z' ],
        [ '2021-05-31T00:00:00Z', '2021-05-31T23:59:59Z' ]
      ])
    })
  })
  describe('calculateSemesterWeekForMoment', () => {
    it('works', () => {
      const semesterStartsAt = moment.utc('2021-01-31T00:00:00', 'YYYY-MM-DD')
      const semesterEndsAt = moment.utc('2021-06-01T00:00:00', 'YYYY-MM-DD')
      const weeks = semesterDateCalc.calculateSemesterWeeks({ semesterStartsAt, semesterEndsAt })
      const target = moment('2021-02-15T01:00:00+01:00')
      const week = semesterDateCalc.calculateSemesterWeekForMoment({ target, weeks})
      expect(week).to.equal(3)
    })
  })
})
