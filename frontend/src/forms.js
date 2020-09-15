import * as React from "react";
import { Filter, List, Datagrid, DateField, TextField, BooleanField, Edit, SimpleForm, TextInput, BooleanInput, Create } from 'react-admin';

const FormFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search" source="description" alwaysOn />
      <TextInput source="form_id" />
  </Filter>
);

export const FormList = props => (
    <List {...props} filters={<FormFilter />}>
        <Datagrid rowClick="edit">
            <TextField source="form_id" />
            <TextField source="description" />
            <BooleanField source="imports_techies" />
        </Datagrid>
    </List>
);

export const FormEdit = props => (
  <Edit {...props}>
      <SimpleForm>
          <TextInput source="form_id" />
          <TextInput source="description" />
          <BooleanInput source="imports_techies" />
          <DateField source="webhook_installed_at" showTime={true} />
      </SimpleForm>
  </Edit>
);

export const FormCreate = props => (
  <Create {...props}>
    <SimpleForm>
          <TextInput source="form_id" />
          <TextInput source="description" />
          <BooleanInput source="imports_techies" />
          <DateField source="webhook_installed_at" />
      </SimpleForm>
  </Create>
);
