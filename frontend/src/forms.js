import * as React from "react";
import { Filter, List, Datagrid, DateField, TextField, BooleanField, ReferenceManyField, ReferenceInput, Edit, SimpleForm, TextInput, BooleanInput, SelectInput, Create } from 'react-admin';
import { RelativeTimeField } from './fields/relativeTime'

const FormFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search" source="description" alwaysOn />
      <TextInput source="form_id" />
  </Filter>
);

export const FormList = props => (
    <List {...props} filters={<FormFilter />} perPage={25}>
        <Datagrid rowClick="edit">
            <TextField source="typeform_id" />
            <TextField source="description" />
            <BooleanField source="imports_techies" />
        </Datagrid>
    </List>
);

const FormTitle = ({ record }) => {
  let title = ''
  if(record && record.description) {
    title = record.description
  } else if(record && record.id) {
    title = record.id
  }
  return <span>Form <strong>{title}</strong></span>;
};

export const FormEdit = props => (
  <Edit title={<FormTitle />} {...props}>
      <SimpleForm>
          <TextInput source="typeform_id" />
          <ReferenceInput label="Semester" source="semester_id" reference="semesters">
              <SelectInput optionText="description" />
          </ReferenceInput>
          <TextInput source="description" />
          <BooleanInput source="imports_techies" />
          <DateField source="webhook_installed_at" showTime={true} />
          <ReferenceManyField label="Form Responses" reference="form_responses" target="form_id">
              <Datagrid rowClick="show">
                <TextField source="techie.first_name" />
                <TextField source="techie.last_name" />
                <TextField label="Time" source="created_at" />
                <RelativeTimeField label="Time ago" source="created_at" />
              </Datagrid>
            </ReferenceManyField>
      </SimpleForm>
  </Edit>
);

export const FormCreate = props => (
  <Create {...props}>
    <SimpleForm>
          <TextInput source="typeform_id" />
          <ReferenceInput label="Semester" source="semester_id" reference="semesters">
              <SelectInput optionText="description" />
          </ReferenceInput>
          <TextInput source="description" />
          <BooleanInput source="imports_techies" />
          <DateField source="webhook_installed_at" />
      </SimpleForm>
  </Create>
);
