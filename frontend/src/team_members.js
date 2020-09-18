import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create
} from 'react-admin';

export const TeamMemberList = props => (
    <List {...props} perPage={25}>
        <Datagrid rowClick="edit">
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
          <TextInput source="first_name" />
          <TextInput source="last_name" />
          <TextInput source="email" />
          <TextInput source="description" />
      </SimpleForm>
  </Edit>
);

export const TeamMemberCreate = props => (
  <Create {...props}>
    <SimpleForm>
          <TextInput source="first_name" />
          <TextInput source="last_name" />
          <TextInput source="email" />
          <TextInput source="description" />
      </SimpleForm>
  </Create>
);
