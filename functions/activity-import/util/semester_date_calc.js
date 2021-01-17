const moment = require('moment')

module.exports = {
  calculateSemesterWeeks: ({ semesterStartsAt, semesterEndsAt }) => {
    // dont support bullshit input ;)
    if(semesterEndsAt.isBefore(semesterStartsAt)) {
      return []
    }
    const endOfFirstWeek = moment(semesterStartsAt).endOf('isoWeek')
    const weeks = [
      [semesterStartsAt, endOfFirstWeek],
    ]
    let oldEnd = moment(endOfFirstWeek).add(1, 's')
    let currentEnd = endOfFirstWeek
    while(true) {
      currentEnd = moment(currentEnd).add(1, 's').endOf('isoWeek')
      if(currentEnd.isAfter(semesterEndsAt)) {
        weeks.push([oldEnd, moment(semesterEndsAt).subtract(1, 's')])
        break
      }
      weeks.push([oldEnd, currentEnd])
      oldEnd = moment(currentEnd).add(1, 's')
    }
    return weeks
  },
  calculateSemesterWeekForMoment: ({ target, weeks }) => {
    for(const [i, [weekStart, weekEnd]] of weeks.entries()) {
      // subtract 1s because isBetween is non-inclusive and we want to have weekStart inclusive
      if(target.isBetween(moment(weekStart).subtract(1, 's'), weekEnd)) {
        return i
      }
    }
    return -1
  }
}
