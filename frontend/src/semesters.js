import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  Create
} from 'react-admin';

export const SemesterList = props => (
    <List {...props} perPage={25}>
        <Datagrid rowClick="edit">
            <TextField source="description" />
        </Datagrid>
    </List>
);

export const SemesterEdit = props => (
  <Edit {...props}>
      <SimpleForm>
          <TextInput source="description" />
          <DateInput source="starts_at" />
          <DateInput source="application_period_ends_at" />
          <DateInput source="academy_phase_ends_at" />
          <DateInput source="ends_at" />
      </SimpleForm>
  </Edit>
);

export const SemesterCreate = props => (
  <Create {...props}>
    <SimpleForm>
          <TextInput source="description" />
          <DateInput source="starts_at" />
          <DateInput source="application_period_ends_at" />
          <DateInput source="academy_phase_ends_at" />
          <DateInput source="ends_at" />
      </SimpleForm>
  </Create>
);
