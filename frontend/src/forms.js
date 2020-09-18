import * as React from "react";
import { Filter, List, Datagrid, DateField, TextField, BooleanField, Edit, SimpleForm, TextInput, BooleanInput, SelectInput, Create } from 'react-admin';

const FormFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search" source="description" alwaysOn />
      <TextInput source="form_id" />
  </Filter>
);

export const FormList = props => (
    <List {...props} filters={<FormFilter />} perPage={25}>
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
          <SelectInput source="semester" choices={[
            { id: 'S_2020_01', name: '2020-01' },
            { id: 'S_2020_02', name: '2020-02' },
          ]} />
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
          <SelectInput source="semester" choices={[
            { id: 'S_2020_01', name: '2020-01' },
            { id: 'S_2020_02', name: '2020-02' },
          ]} />
          <TextInput source="description" />
          <BooleanInput source="imports_techies" />
          <DateField source="webhook_installed_at" />
      </SimpleForm>
  </Create>
);
