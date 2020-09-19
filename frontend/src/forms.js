import * as React from "react";
import { Filter, List, Datagrid, DateField, TextField, ReferenceManyField, ReferenceInput, Edit, SimpleForm, TextInput, SelectInput, Create } from 'react-admin';
import { FormTypeSelectField } from "./fields/formTypeSelect";
import { RelativeTimeField } from './fields/relativeTime'
import { FormTypeSelectInput } from "./inputs/formTypeSelect";

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
            <FormTypeSelectField source="form_type" />
            <TextField source="description" />
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
          <ReferenceInput label="Semester" source="semester_id" reference="semesters">
              <SelectInput optionText="description" />
          </ReferenceInput>
          <TextInput source="typeform_id" />
          <FormTypeSelectInput source="form_type" />
          <TextInput source="description" />
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
          <ReferenceInput label="Semester" source="semester_id" reference="semesters">
              <SelectInput optionText="description" />
          </ReferenceInput>
          <TextInput source="typeform_id" />
          <FormTypeSelectInput source="form_type" />
          <TextInput source="description" />
      </SimpleForm>
  </Create>
);
