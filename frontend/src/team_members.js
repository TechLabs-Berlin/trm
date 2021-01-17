import * as React from "react"
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  required
} from 'react-admin'

import { FunctionalTeamSelectField } from './fields/functionalTeamSelect'
import { FunctionalTeamSelectInput } from './inputs/functionalTeamSelect'

export const TeamMemberList = props => (
    <List {...props} perPage={25}>
        <Datagrid rowClick="edit">
            <FunctionalTeamSelectField source="functional_team" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <TextField source="description" />
        </Datagrid>
    </List>
);

const TeamMemberTitle = ({ record }) => {
  if(record && record.first_name && record.last_name) {
    return <span>Team Member <strong>{record.first_name} {record.last_name}</strong></span>
  } else if(record && record.id) {
    return <span>Team Member <strong>{record.id}</strong></span>
  }
  return <span>Team Member</span>;
};

export const TeamMemberEdit = props => (
  <Edit title={<TeamMemberTitle />} {...props}>
      <SimpleForm>
          <TextInput source="first_name" validate={required()} />
          <TextInput source="last_name" validate={required()} />
          <TextInput source="email" validate={required()} />
          <FunctionalTeamSelectInput source="functional_team" />
          <TextInput source="description" />
      </SimpleForm>
  </Edit>
);

export const TeamMemberCreate = props => (
  <Create {...props}>
    <SimpleForm>
          <TextInput source="first_name" validate={required()} />
          <TextInput source="last_name" validate={required()} />
          <TextInput source="email" validate={required()} />
          <FunctionalTeamSelectInput source="functional_team" />
          <TextInput source="description" validate={required()} />
      </SimpleForm>
  </Create>
);
