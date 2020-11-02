import * as React from "react"
import PropTypes from 'prop-types'

import { gql } from 'apollo-boost'
import { groupBy } from 'lodash'

import {
  ListContextProvider,
  Datagrid,
  Title,
  Loading,
  useTranslate,
} from 'react-admin';

import {
  Card,
  CardContent,
  makeStyles,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography
} from '@material-ui/core'

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { buildClient } from '../../dataProvider'
import { ActivityField } from './activityField'
import { TechieField } from '../../fields/techie'

const GET_ACTIVITY = gql`
  query($startDate: String!, $endDate: String!) {
    techie_activity_reports(
      args: {startdate: $startDate, enddate: $endDate}
      where: {techie: {state: {_eq: LEARNER}}}
    ) {
      type
      value
      week
      year
      techie {
        first_name
        last_name
        email
        track
        state
      }
    }
  }
`

const useStyles = makeStyles(theme => ({
  filter: {
    marginBottom: theme.spacing(2)
  }
}))

const TabPanel = props => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export const TechieActivityPage = () => {
  const [loading, setLoading] = React.useState(true)
  const [records, setRecords] = React.useState({})
  const [weeks, setWeeks] = React.useState([])
  const [types, setTypes] = React.useState([])
  const [startDate, setStartDate] = React.useState('2020-10-01')
  const [endDate, setEndDate] = React.useState('2020-12-01')
  const [currentTab, setCurrentTab] = React.useState(0)
  const classes = useStyles()
  const translate = useTranslate()

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
      let types = []
      for(const [email, records] of Object.entries(activityByTechie)) {
        let techieProps = {}
        if(records.length > 0) {
          techieProps = {
            first_name: records[0].techie.first_name,
            last_name: records[0].techie.last_name,
            track: records[0].techie.track
          }
        }
        types = Array.from(new Set(records.map(r => r.type)))
        types.unshift('all')
        const byWeek = groupBy(records, report => `${report.year}-${report.week}`)
        newActivity[email] = {
          id: email,
          techie: techieProps,
          weeks: byWeek,
        }
        newWeeks = Object.keys(byWeek)
      }
      setRecords(newActivity)
      setTypes(types)
      setWeeks(newWeeks)
      setLoading(false)
    }
    update()
  }, [startDate, endDate])

  const handleTabChange = (_, currentTab) => setCurrentTab(currentTab)

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
                <Tabs value={currentTab} onChange={handleTabChange}>
                  {types.map(t => (
                    <Tab key={t} label={translate(`resources.techie_activity.fields.type_values.${t}`)} />
                  ))}
                </Tabs>
                {types.map((t, i) => (
                  <TabPanel key={t} value={currentTab} index={i}>
                    <ListContextProvider value={{
                      data: Object.entries(records).reduce((acc, [email, record]) => {
                        acc[email] = {
                          id: record.id,
                          ...record.techie
                        }
                        if(t === 'all') {
                          acc[email] = {
                            ...acc[email],
                            ...record.weeks,
                          }
                        } else {
                          const weeksFiltered = Object.entries(record.weeks).reduce((acc, [week, activities]) => {
                            acc[week] = activities.filter(a => a.type === t)
                            return acc
                          }, {})
                          acc[email] = {
                            ...acc[email],
                            ...weeksFiltered
                          }
                        }
                        return acc
                      }, {}),
                      ids: Object.keys(records),
                      total: Object.keys(records).length,
                      currentSort: { field: 'id', order: 'ASC' },
                      basePath: "/posts", // TODO remove, but throws an error
                      resource: 'posts', // TODO remove, but throws an error
                      selectedIds: []
                    }}>
                        <Datagrid>
                          <TechieField sortable={true} />
                          {weeks.map(week => <ActivityField key={week} source={week} sortable={true}/>)}
                        </Datagrid>
                    </ListContextProvider >
                  </TabPanel>
                ))}
              </div>
            )}
          </CardContent>
      </Card>
    </MuiPickersUtilsProvider>
  )
}
