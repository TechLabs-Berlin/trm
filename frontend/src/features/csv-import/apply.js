import * as React from "react";

import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  resultContainer: {
    padding: theme.spacing(2),
    width: '400px'
  },
  updateStats: {
    '&:first-child': {
      marginTop: theme.spacing(2)
    },
    '&:not(:last-child)': {
      marginBottom: theme.spacing(2)
    }
  },
  failedList: {
    marginTop: 0,
    listStylePosition: 'inside'
  }
}))

const Apply = ({ records, isUpdateRunning }) => {
  const classes = useStyles()
  const numPending = Object.values(records).filter(r => r.updateState === 'PENDING').length
  const numSuccessful = Object.values(records).filter(r => r.updateState === 'SUCCESSFUL').length
  const failedEmails = Object.entries(records).reduce((acc, [email, record]) => {
    if(record.updateState === 'FAILED') {
      let message = email
      if('updateError' in record) {
        message += ': ' + record.updateError
      }
      acc.push(message)
    }
    return acc
  }, [])

  return (
    <Paper square elevation={2} className={classes.resultContainer}>
      {isUpdateRunning ? (
        <Typography variant='h4' align='center' color='secondary'>
          <CircularProgress style={{ verticalAlign: 'top', marginRight: '10px' }}/>
          Update running…
        </Typography>
      ) : (
        <Typography variant='h4' align='center' color='secondary'>
          <CheckCircleOutlineIcon fontSize={'large'} style={{ verticalAlign: 'top', marginRight: '10px' }} />
          Update finished.
        </Typography>
      )}
      <div>
        <Typography align='center' className={classes.updateStats}><strong>Pending Updates:</strong> {numPending}</Typography>
        <Typography align='center' className={classes.updateStats}><strong>Successful Updates:</strong> {numSuccessful}</Typography>
        <Typography align='center' className={classes.updateStats}>
          <strong>Failed Updates:</strong>
          {failedEmails.length === 0 ? ' None' : (<ul className={classes.failedList}>
            {failedEmails.map((email) => {
              return <li key={email}>{email}</li>
            })}
          </ul>)}
        </Typography>
      </div>
    </Paper>
  )
}

export default Apply
