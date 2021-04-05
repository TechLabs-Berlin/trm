import * as React from "react";

import {
  Title,
  useDataProvider
} from 'react-admin';

import parseCSV from 'csv-parse/lib/sync'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';

import CSVImportInput from './input'
import CSVImportList from './list'
import CSVImportApply from './apply'

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return ['Enter CSV Data', 'Verify Changes', 'Apply Changes'];
}

function getStepContent(step, csv, onUpdateCSV, records, isReady, isUpdateRunning, validation) {
  switch (step) {
    case 0:
      return <CSVImportInput csv={csv} onUpdateCSV={onUpdateCSV} validation={validation} />
    case 1:
      return <CSVImportList records={records} isReady={isReady} />;
    case 2:
      return <CSVImportApply records={records} isUpdateRunning={isUpdateRunning} />
    default:
      return 'Unknown step';
  }
}

// https://gist.github.com/alexpsi/43dd7fd4d6a263c7485326b843677740
const runChunkedPromise = async (xs, f, n=Infinity) => {
	const finished = Symbol();
	let promises = xs.slice(0, n).map(f), others = xs.slice(n);
	while (promises.length) {
		await Promise.race(promises.map(promise => promise.then(() => {promise[finished] = true;})));
		promises = promises.filter(promise => !promise[finished]);
		promises.push(...others.splice(0, n - promises.length).map(f));
  }
};

const csvSchema = {
  email: () => [],
  first_name: () => [],
  last_name: () => [],
  notes: () => [],
  google_account: () => [],
  github_handle: () => [],
  linkedin_profile_url: () => [],
  edyoucated_user_id: () => [],
  age: () => [],
  project_name: () => [],
  state: (value) => {
    const validValues = ['PROSPECT', 'APPLICANT', 'REJECTED', 'LEARNER', 'DROPPED', 'ALUMNI']
    if(!validValues.includes(value)) {
      return [`${value} not in ${validValues.join(', ')}`]
    }
    return []
  },
  track: (value) => {
    const validValues = ['DS', 'AI', 'WEBDEV', 'UX']
    if(!validValues.includes(value)) {
      return [`${value} not in ${validValues.join(', ')}`]
    }
    return []
  },
  gender: (value) => {
    const validValues = ['male', 'female']
    if(!validValues.includes(value)) {
      return [`${value} not in ${validValues.join(', ')}`]
    }
    return []
  },
}

const validate = (csv) => {
  let records
  try {
    records = parseCSV(csv, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';'
    })
  } catch(err) {
    return {
      valid: false,
      errors: {
        csv: [err]
      }
    }
  }

  if(records.length === 0) {
    return {
      valid: false,
      errors: {
        csv: ['must have at least one line']
      }
    }
  }

  if(!('email' in records[0])) {
    return {
      valid: false,
      errors: {
        email: ['attribute must exist to identify Techies']
      }
    }
  }

  const result = {
    valid: true,
    errors: {}
  }

  // Run validators
  for(const [attr, validate] of Object.entries(csvSchema)) {
    if(!(attr in records[0])) {
      continue
    }
    for(const record of records) {
      const validateResult = validate(record[attr])
      if(validateResult.length > 0) {
        result.valid = false
        if(!(attr in result.errors)) {
          result.errors[attr] = []
        }
        result.errors[attr].push(validateResult)
      }
    }
  }

  // Check for extra attributes
  for(const attr of Object.keys(records[0])) {
    if(!Object.keys(csvSchema).includes(attr)) {
      result.valid = false
      result.errors[attr] = ['is unsupported']
    }
  }
  return result
}

const resolvers = ({dataProvider}) => ({
  project_name: async ({value, techie}) => {
    if(!value || (typeof value !== 'string') || value.length === 0) {
      return { project_id: null }
    }
    const { data: projects } = await dataProvider.getList('projects', {
      filter: { name: value, semester_id: techie.semester_id }
    })
    if(projects.length === 0) {
      return Promise.reject(`Project ${value} not found`)
    }
    if(projects.length > 1) {
      return Promise.reject(`Project name ${value} is not unique`)
    }
    return {
      project_id: projects[0].id
    }
  }
})

const CSVImportPage = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [csv, setCSV] = React.useState('email;state\nsome.techie@gmail.com;LEARNER')
  const [validation, setValidation] = React.useState(validate(csv))
  const dataProvider = useDataProvider()
  const [records, setRecords] = React.useState({})
  const [isReady, setReady] = React.useState(false)
  const [isUpdateRunning, setUpdateRunning] = React.useState(false)
  const steps = getSteps();

  React.useEffect(() => {
    const validation = validate(csv)
    setValidation(validation)
    if(!validation.valid) {
      return
    }

    const rawRecords = parseCSV(csv, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';'
    })
    const newRecords = rawRecords.reduce((acc, r) => {
      const {email, ...changes} = r
      acc[email] = {
        id: email,
        state: 'NOT_FOUND',
        updateState: 'PENDING',
        changes
      }
      return acc
    }, {})

    const fetchTechies = async () => {
      const emails = Object.keys(newRecords)
      const response = await dataProvider.getList('techies', { filter: { email: emails } })
      for(let techie of response.data) {
        if(!(techie.email in newRecords)) {
          continue
        }
        const record = newRecords[techie.email]
        record.state = 'FOUND'
        record.attributes = techie
        // Run resolvers
        for(const [attr, resolve] of Object.entries(resolvers({dataProvider}))) {
          if(!(attr in record.changes)) {
            continue
          }
          try {
            const result = await resolve({value: record.changes[attr], techie})
            record.changes = Object.assign(record.changes, result)
            delete record.changes[attr]
          } catch(e) {
            record.state = 'INVALID'
          }
        }
      }
      setRecords(newRecords)
      setReady(true)
    }
    fetchTechies()
  }, [csv, dataProvider])

  const doUpdate = React.useCallback(() => {
    const singleUpdate = ([email, record]) => {
      if(record.state !== 'FOUND' || !('attributes' in record)) {
        record.updateState = 'FAILED'
        records[email] = record
        setRecords(records)
        return Promise.resolve()
      }
      return dataProvider.update('techies', {
        id: record.attributes.id,
        data: record.changes
      }).then(() => {
        record.updateState = 'SUCCESSFUL'
        records[email] = record
        setRecords(records)
      }).catch(err => {
        record.updateState = 'FAILED'
        record.updateError = err
        records[email] = record
        setRecords(records)
      })
    }
    setUpdateRunning(true)
    runChunkedPromise(Object.entries(records), singleUpdate, 5).then(() => {
      setUpdateRunning(false)
    }).catch(err => console.error(err))
  }, [records, dataProvider])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  React.useEffect(() => {
    if(activeStep === 2) {
      doUpdate()
    }
  }, [activeStep, doUpdate])

  return (
    <Card>
        <Title title="CSV Import" />
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                  {getStepContent(index, csv, setCSV, records, isReady, isUpdateRunning, validation)}
                  <div className={classes.actionsContainer}>
                      {activeStep <= steps.length - 2 ? (
                        <React.Fragment>
                          <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              className={classes.button}
                          >
                              Back
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                            disabled={!validation.valid}
                          >
                            Next
                          </Button>
                        </React.Fragment>
                      ) : ''}
                    </div>
                  </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
    </Card>
  );
}

export default CSVImportPage;
