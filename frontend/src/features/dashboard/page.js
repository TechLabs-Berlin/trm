import * as React from 'react'
import { sample } from 'lodash'

import {
  Title,
  useGetList,
  useGetIdentity,
  useTranslate,
} from 'react-admin';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import {
  Typography,
  Grid,
  makeStyles,
  CircularProgress,
} from '@material-ui/core'

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  heading: {
    marginTop: theme.spacing(5),
  },
  type: {
    fontSize: 20,
  },
  errorIcon: {
    color: 'red',
  },
  largeIcon: {
    fontSize: '42pt',
  },
}))

const AcademyCard = () => {
  const classes = useStyles()
  const { data, loading, error } = useGetList('techie_stats', { page: 1, perPage: 50 }, { field: 'id', order: 'ASC' })

  const stat = !loading && !error ? Object.values(data).find(d => d.state === 'LEARNER') : null
  const count = stat ? stat.count : 0

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" component="h2">
          { loading ? <CircularProgress /> : null}
          { error ? <ErrorOutlineIcon fontSize="large" className={classes.errorIcon} /> : null }
          { !loading && !error ? count : null}
        </Typography>
        <Typography className={classes.type} color="textSecondary">
          Techies
        </Typography>
        <Typography color="textSecondary">
          currently learning
        </Typography>
      </CardContent>
    </Card>
  )
}

const AlumniCard = () => {
  const classes = useStyles()
  const { data, loading, error } = useGetList('techie_stats', { page: 1, perPage: 50 }, { field: 'id', order: 'ASC' })

  const stat = !loading && !error ? Object.values(data).find(d => d.state === 'ALUMNI') : null
  const count = stat ? stat.count : 0

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" component="h2">
          { loading ? <CircularProgress /> : null}
          { error ? <ErrorOutlineIcon fontSize="large" className={classes.errorIcon} /> : null }
          { !loading && !error ? count : null}
        </Typography>
        <Typography className={classes.type} color="textSecondary">
          Alumni
        </Typography>
        <Typography color="textSecondary">
          have finished
        </Typography>
      </CardContent>
    </Card>
  )
}

const ActiveUserCard = () => {
  const classes = useStyles()
  const { data, loading: statsLoading, error } = useGetList('team_member_stats', { page: 1, perPage: 50 }, { field: 'id', order: 'ASC' })
  const { identity, loading: identityLoading } = useGetIdentity()

  const stat = !statsLoading && !error ? Object.values(data).find(d => d.id === identity.location) : null
  const count = stat ? stat.count : 0

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" component="h2">
          { statsLoading || identityLoading ? <CircularProgress /> : null}
          { error ? <ErrorOutlineIcon fontSize="large" className={classes.errorIcon} /> : null }
          { !statsLoading && !identityLoading && !error ? count : null}
        </Typography>
        <Typography className={classes.type} color="textSecondary">
          Active Local Users
        </Typography>
        <Typography color="textSecondary">
          in the TRM
        </Typography>
      </CardContent>
    </Card>
  )
}

const TRMLocationsCard = () => {
  const classes = useStyles()
  const { data, loading, error } = useGetList('team_member_stats', { page: 1, perPage: 50 }, { field: 'id', order: 'ASC' })

  const count = !loading && !error ? Object.keys(data).length : 0

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" component="h2">
          { loading ? <CircularProgress /> : null}
          { error ? <ErrorOutlineIcon fontSize="large" className={classes.errorIcon} /> : null }
          { !loading && !error ? count : null}
        </Typography>
        <Typography className={classes.type} color="textSecondary">
          Locations
        </Typography>
        <Typography color="textSecondary">
          actively use the TRM
        </Typography>
      </CardContent>
    </Card>
  )
}

const GreetingCard = () => {
  const classes = useStyles()
  const { identity, loading } = useGetIdentity()

  const greetings = [
    'Bonjour',
    'Hola',
    'Nǐn hǎo',
    'Salve',
    'Konnichiwa',
    'Guten Tag',
    'Olá',
    'Asalaam alaikum',
    'Goddag',
    'Goedentag',
    'Dzień dobry',
    'Namaste, Namaskar',
    'Shalom'
  ]

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" component="h2">
          { loading ? <CircularProgress /> : identity.firstName }
        </Typography>
        <Typography className={classes.type} color="textSecondary">
          {`${sample(greetings)}!`}
        </Typography>
        <Typography color="textSecondary">
          Thanks for visiting.
        </Typography>
      </CardContent>
    </Card>
  )
}

const LocationCard = () => {
  const classes = useStyles()
  const translate = useTranslate()
  const { identity, loading } = useGetIdentity()

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" component="h2">
          { loading ? <CircularProgress /> : <FavoriteBorderIcon className={classes.largeIcon} />}
        </Typography>
        <Typography className={classes.type} color="textSecondary">
          { !loading && 'much love to' }
        </Typography>
        <Typography color="textSecondary">
          { !loading && `TechLabs ${translate('techlabs.locations.'+identity.location)}` }
        </Typography>
      </CardContent>
    </Card>
  )
}

const DashboardPage = () => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Title title="Dashboard" />
      <Grid container spacing={4}>
        <Grid item>
          <GreetingCard />
        </Grid>
        <Grid item>
          <LocationCard />
        </Grid>
      </Grid>

      <h2 className={classes.heading}>TechLabs Berlin</h2>
      <Grid container spacing={4}>
        <Grid item>
          <AcademyCard />
        </Grid>
        <Grid item>
          <AlumniCard />
        </Grid>
        <Grid item>
          <ActiveUserCard />
        </Grid>
      </Grid>

      <h2 className={classes.heading}>Global</h2>
      <Grid container spacing={4}>
        <Grid item>
          <TRMLocationsCard />
        </Grid>
      </Grid>
    </div>

  )
}

export default DashboardPage
