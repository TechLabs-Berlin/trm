import * as React from "react";
import { useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  Create,
  required,
  TopToolbar,
  useNotify,
} from 'react-admin';
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/core/styles'
import { TermSelectField } from "./fields/termSelect";
import { TermSelectInput } from "./inputs/termSelect";
import config from './config'

export const SemesterList = props => (
    <List {...props} perPage={25}>
        <Datagrid rowClick="edit">
            <TermSelectField source="term" />
            <TextField source="description" />
        </Datagrid>
    </List>
);

const SemesterTitle = ({ record }) => {
  if(record && record.description) {
    return <span>Semester <strong>{record.description}</strong></span>
  } else if(record && record.id) {
    return <span>Semester <strong>{record.id}</strong></span>
  }
  return <span>Semester</span>;
};

const TechieKeyPrefixExplanation = () => (
  <Alert variant="outlined" severity="info">
    <p>The Techie Key Prefix is optional. If it is set, the prefix is added to the Techie Keys generated when Techies apply.</p>
    <p><strong>Without prefix:</strong> LOC://ID</p>
    <p><strong>With prefix:</strong> LOC://PREFIX/ID</p>
  </Alert>
)

const EdyoucatedTeamIDExplanation = () => (
  <Alert variant="outlined" severity="info">
    <p>The edyoucated team ID refers to the team you created on the edyoucated platform. You can see it in the URL when you open the <i>Analytics Report</i> for your team.</p>
    <p>If you don't manage to find it, please reach out on Slack. This is a todo to be improved in the future.</p>
  </Alert>
)

const downloadCertificates = async ({ semesterID }) => {
  const blob = await fetch(config.certificateFnURL, {
    method: 'POST',
    body: JSON.stringify({ semesterID }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  })
  .then(resp => resp.ok ? Promise.resolve(resp) : Promise.reject(`Status ${resp.status}`))
  .then(resp => resp.blob())

  // from https://github.com/marmelab/react-admin/blob/fe4bab7a72ccbfcb65e851b8ea61102b2369c154/packages/ra-core/src/export/downloadCSV.ts
  const fakeLink = document.createElement('a')
  fakeLink.style.display = 'none'
  document.body.appendChild(fakeLink)
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // Manage IE11+ & Edge
      window.navigator.msSaveOrOpenBlob(blob, 'certificates.zip')
  } else {
      fakeLink.setAttribute('href', URL.createObjectURL(blob))
      fakeLink.setAttribute('download', 'certificates.zip')
      fakeLink.click()
  }
}

const useStyles = makeStyles(theme => ({
  progress: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  text: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    lineHeight: 1.5,
  }
}))

const SemesterEditActions = ({ data }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const notify = useNotify();
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const handleDownload = async () => {
    setRunning(true)
    try {
      await downloadCertificates({ semesterID: data.id })
    } catch(err) {
      notify('Error: ' + err)
    } finally {
      setRunning(false)
    }
  }
  return (
    <TopToolbar>
      {data && <React.Fragment>
        <Button color="primary" onClick={handleClick}>Download Certificates</Button>
        <Dialog onClose={handleDialogClose} open={open}>
          <DialogTitle>Download Digital Shaper Certificates</DialogTitle>
          <DialogContent>
            <p className={classes.text}>
              Certificates are generated for Techies in the semester <strong>{data.description}</strong> who have the <strong>Alumni</strong> state.
              To make the certificates look right, ensure these Techies have a <strong>Track</strong> and are associated with a <strong>Project</strong>.
            </p>
            <p className={classes.text}>
              The certificates are generated on-the-fly. Depending on the number of Techies, this may take a minute or two.
            </p>
            <LinearProgress className={classes.progress} variant={running ? 'indeterminate' : 'determinate'} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDownload} disabled={running} color="primary">
              Generate & download
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>}
    </TopToolbar>
  )
}

export const SemesterEdit = props => (
  <Edit undoable={false} title={<SemesterTitle />} actions={<SemesterEditActions />} {...props}>
      <SimpleForm redirect="edit">
          <TermSelectInput source="term" validate={required()} />
          <TextInput source="description" validate={required()} />
          <TextInput source="edyoucated_team_id" />
          <EdyoucatedTeamIDExplanation />
          <DateInput source="starts_at" />
          <DateInput source="application_period_ends_at" />
          <DateInput source="academy_phase_ends_at" />
          <DateInput source="ends_at" />
          <TextInput source="techie_key_prefix" />
          <TechieKeyPrefixExplanation />
      </SimpleForm>
  </Edit>
);

export const SemesterCreate = props => (
  <Create {...props}>
    <SimpleForm undoable={false}>
          <TermSelectInput source="term" validate={required()} />
          <TextInput source="description" validate={required()} />
          <TextInput source="edyoucated_team_id" />
          <EdyoucatedTeamIDExplanation />
          <DateInput source="starts_at" />
          <DateInput source="application_period_ends_at" />
          <DateInput source="academy_phase_ends_at" />
          <DateInput source="ends_at" />
          <TextInput source="techie_key_prefix" />
          <TechieKeyPrefixExplanation />
      </SimpleForm>
  </Create>
);
