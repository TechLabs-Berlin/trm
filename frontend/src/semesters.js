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

export const SemesterEdit = props => (
  <Edit undoable={false} title={<SemesterTitle />} {...props}>
      <SimpleForm redirect="edit">
          <TermSelectInput source="term" validate={required()} />
          <TextInput source="description" validate={required()} />
          <DateInput source="starts_at" />
          <DateInput source="application_period_ends_at" />
          <DateInput source="academy_phase_ends_at" />
          <DateInput source="ends_at" />
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
      </SimpleForm>
  </Create>
);
