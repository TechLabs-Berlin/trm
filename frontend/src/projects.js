import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  required,
  ReferenceInput,
  SelectInput,
  ReferenceManyField,
  ReferenceField,
} from 'react-admin';
import { TechieField } from './fields/techie';

export const ProjectList = props => (
  <List {...props} perPage={25}>
      <Datagrid rowClick="edit">
          <TextField source="name" />
      </Datagrid>
  </List>
)

const ProjectTitle = ({ record }) => {
  return <span>Project <strong>{record.name}</strong></span>
}

export const ProjectEdit = props => (
  <Edit title={<ProjectTitle />} {...props}>
      <SimpleForm>
          <ReferenceInput label="Semester" source="semester_id" reference="semesters">
            <SelectInput optionText="description" validate={required()} />
          </ReferenceInput>
          <TextInput source="name" validate={required()} />
          <TextInput source="description" />
          <ReferenceManyField label="Techies" reference="techies" target="project_id">
            <Datagrid>
              <ReferenceField label="Techie" source="id" reference="techies">
                <TechieField />
              </ReferenceField>
              <TextField source="email" />
            </Datagrid>
          </ReferenceManyField>
      </SimpleForm>
  </Edit>
)

export const ProjectCreate = props => (
  <Create {...props}>
    <SimpleForm>
          <ReferenceInput label="Semester" source="semester_id" reference="semesters">
            <SelectInput optionText="description" validate={required()} />
          </ReferenceInput>
          <TextInput source="name" validate={required()} />
          <TextInput source="description" />
      </SimpleForm>
  </Create>
)
