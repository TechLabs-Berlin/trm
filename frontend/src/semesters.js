import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  Create,
  required
} from 'react-admin';
import Alert from '@material-ui/lab/Alert'
import { TermSelectField } from "./fields/termSelect";
import { TermSelectInput } from "./inputs/termSelect";

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

export const SemesterEdit = props => (
  <Edit undoable={false} title={<SemesterTitle />} {...props}>
      <SimpleForm redirect="edit">
          <TermSelectInput source="term" validate={required()} />
          <TextInput source="description" validate={required()} />
          <TextInput source="edyoucated_team_id" />
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
          <DateInput source="starts_at" />
          <DateInput source="application_period_ends_at" />
          <DateInput source="academy_phase_ends_at" />
          <DateInput source="ends_at" />
          <TextInput source="techie_key_prefix" />
          <TechieKeyPrefixExplanation />
      </SimpleForm>
  </Create>
);
