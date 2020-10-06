import * as React from "react";

import { gql } from 'apollo-boost';
import { groupBy } from 'lodash'

import {
  ListContextProvider,
  Datagrid,
  Title,
  Loading
} from 'react-admin';

import {
  Card,
  CardContent,
  makeStyles,
  Paper
} from '@material-ui/core'

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { buildClient } from '../../dataProvider'
import { ActivityField } from './activityField'
import { TechieField } from '../../fields/techie'

const GET_ACTIVITY = gql`
  query($startDate: String!, $endDate: String!) {
    techie_activity_reports(args: {startdate: $startDate, enddate: $endDate}) {
      type
      value
      week
      year
      techie {
        first_name
        last_name
        email
        track
      }
    }
  }
`

const useStyles = makeStyles(theme => ({
  filter: {
    marginBottom: theme.spacing(2)
  }
}))

export const TechieActivityPage = () => {
  const [loading, setLoading] = React.useState(true)
  const [records, setRecords] = React.useState({})
  const [weeks, setWeeks] = React.useState([])
  const [startDate, setStartDate] = React.useState('2020-10-01')
  const [endDate, setEndDate] = React.useState('2020-12-01')
  const classes = useStyles()

  React.useEffect(() => {
    const update = async () => {
      const client = buildClient()
      const resp = await client.query({
        query: GET_ACTIVITY,
        variables: {
          startDate,
          endDate
        }
      })
      const activityByTechie = groupBy(resp.data.techie_activity_reports, report => report.techie.email)
      const newActivity = {}
      let newWeeks = []
      for(const [email, records] of Object.entries(activityByTechie)) {
        let techieProps = {}
        if(records.length > 0) {
          techieProps = {
            first_name: records[0].techie.first_name,
            last_name: records[0].techie.last_name,
            track: records[0].techie.track
          }
        }
        const byWeek = groupBy(records, report => `${report.year}-${report.week}`)
        newActivity[email] = {
          id: email,
          ...byWeek,
          ...techieProps
        }
        newWeeks = Object.keys(byWeek)
      }
      setRecords(newActivity)
      setWeeks(newWeeks)
      setLoading(false)
    }
    update()
  }, [startDate, endDate])

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Card>
          <Title title="Techie Activity" />
          <CardContent>
            { loading ? (
              <Loading/>
            ) : (
              <div>
                <Paper square elevation={0} className={classes.filter}>
                  <DatePicker label="Start Date" value={startDate} onChange={setStartDate} disableFuture={true} views={["year", "month"]} variant="inline" />
                  <DatePicker label="End Date" value={endDate} onChange={setEndDate} views={["year", "month"]} variant="inline" />
                </Paper>
                <ListContextProvider value={{
                  data: records,
                  ids: Object.keys(records),
                  total: Object.keys(records).length,
                  currentSort: { field: 'id', order: 'ASC' },
                  basePath: "/posts", // TODO remove, but throws an error
                  resource: 'posts', // TODO remove, but throws an error
                  selectedIds: []
                }}>
                    <Datagrid>
                      <TechieField sortable={false} />
                      {weeks.map(week => <ActivityField key={week} source={week} sortable={false}/>)}
                    </Datagrid>
                </ListContextProvider >
              </div>
            )}
          </CardContent>
      </Card>
    </MuiPickersUtilsProvider>
  )
}
