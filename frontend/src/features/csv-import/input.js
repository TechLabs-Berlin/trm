import * as React from "react";

import {
  Paper,
  TextField,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core'

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
  validationStatus: {
    marginTop: theme.spacing(2)
  },
  validationErrors: {
    marginTop: theme.spacing(1)
  }
}))

const Input = ({ csv, validation, onUpdateCSV }) => {
  const classes = useStyles()
  const onChange = event => onUpdateCSV(event.target.value)
  return (
    <Grid container spacing={3}>
      <Grid item sm={12} md={12} xl={8}>
        <Paper square elevation={0}>
          <TextField
            label="CSV"
            multiline
            fullWidth
            rows={10}
            variant="outlined"
            onChange={onChange}
            value={csv}
          />
          <Typography className={classes.validationStatus}>
            {validation.valid ? (
              <Typography variant='body1'>
                <CheckCircleOutlineIcon style={{ verticalAlign: 'top', marginRight: '5px'}}/>
                CSV is <strong>valid</strong>.
              </Typography>
            ) : (
              <div>
                <Typography variant='body1' color='secondary'>
                  <ErrorOutlineIcon style={{ verticalAlign: 'top', marginRight: '5px'}}/>
                  CSV is <strong>invalid</strong>.
                </Typography>
                <ul className={classes.validationErrors}>
                  {Object.entries(validation.errors).map(([field, errors]) => {
                    return (
                      <li key={field}>
                        <strong>{field}</strong>: {errors.join(', ')}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </Typography>
        </Paper>
      </Grid>
      <Grid item sm={12} md={12} xl={4}>
        <Typography variant='h5'>Documentation</Typography>
        <Typography variant='body1'>
          <p>
            Techies are identified by their <strong>email</strong>.
            <br/>
            Enter CSV in the text field with <strong>separator ";"</strong>.
          </p>
        </Typography>
        <Typography variant='body1'>
          <p>
            The <strong>email</strong> field is always needed to identify Techies.
            You can update the following attributes:
            <ul>
              <li><strong>first_name</strong></li>
              <li><strong>last_name</strong></li>
              <li><strong>notes</strong></li>
              <li><strong>google_account</strong></li>
              <li><strong>github_handle</strong></li>
              <li><strong>linkedin_profile_url</strong></li>
              <li><strong>age</strong></li>
              <li><strong>state</strong>: one of <i>PROSPECT</i>, <i>APPLICANT</i>, <i>REJECTED</i>, <i>LEARNER</i>, <i>DROPPED</i>, or <i>ALUMNI</i></li>
              <li><strong>track</strong>: one of <i>DS</i>, <i>AI</i>, <i>WEBDEV</i>, or <i>UX</i></li>
              <li><strong>gender</strong>: one of <i>male</i>, or <i>female</i></li>
            </ul>
          </p>
        </Typography>
      </Grid>
    </Grid>

  )
}

export default Input
