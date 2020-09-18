import * as React from "react";
import {
  Filter,
  List,
  Datagrid,
  SelectField,
  TextField,
  Edit,
  SimpleForm,
  TabbedForm,
  FormTab,
  ReferenceManyField,
  TextInput,
  SelectInput,
  Create,
  Toolbar,
  SaveButton
} from 'react-admin';

const TechieFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search" source="techie_key" alwaysOn />
      <TextInput source="email" />
      <SelectInput source="semester" choices={[
        { id: 'S_2020_01', name: '2020-01' },
        { id: 'S_2020_02', name: '2020-02' },
      ]} />
      <SelectInput source="state" choices={[
        { id: 'PROSPECT', name: 'Prospect' },
        { id: 'APPLICANT', name: 'Applicant' },
        { id: 'REJECTED', name: 'Rejected' },
        { id: 'LEARNER', name: 'Learner' },
        { id: 'DROPPED', name: 'Dropped' },
        { id: 'ALUMNI', name: 'Alumni' },
      ]} />
  </Filter>
);

export const TechieList = props => (
    <List {...props} filters={<TechieFilter />} perPage={25}>
        <Datagrid rowClick="edit">
            <SelectField source="semester" choices={[
              { id: 'S_2020_01', name: '2020-01' },
              { id: 'S_2020_02', name: '2020-02' },
            ]} />
            <SelectField source="state" choices={[
              { id: 'PROSPECT', name: 'Prospect' },
              { id: 'APPLICANT', name: 'Applicant' },
              { id: 'REJECTED', name: 'Rejected' },
              { id: 'LEARNER', name: 'Learner' },
              { id: 'DROPPED', name: 'Dropped' },
              { id: 'ALUMNI', name: 'Alumni' },
            ]} />
            <TextField source="first_name" />
            <TextField source="last_name" />
        </Datagrid>
    </List>
);

const TechieEditToolbar = props => (
  <Toolbar {...props} >
      <SaveButton />
  </Toolbar>
);


export const TechieEdit = props => (
  <Edit {...props}>
      <TabbedForm toolbar={<TechieEditToolbar />}>
          <FormTab label="Master Data">
            <SelectInput source="semester" choices={[
              { id: 'S_2020_01', name: '2020-01' },
              { id: 'S_2020_02', name: '2020-02' },
            ]} />
            <SelectInput source="state" choices={[
              { id: 'PROSPECT', name: 'Prospect' },
              { id: 'APPLICANT', name: 'Applicant' },
              { id: 'REJECTED', name: 'Rejected' },
              { id: 'LEARNER', name: 'Learner' },
              { id: 'DROPPED', name: 'Dropped' },
              { id: 'ALUMNI', name: 'Alumni' },
            ]} />
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <TextInput source="email" />
            <TextField source="techie_key" />
          </FormTab>
          <FormTab label="Form Submissions">
            <ReferenceManyField label="Form Submissions by Techie" reference="form_submissions" target="techie_id">
              <Datagrid rowClick="show">
                <TextField label="Form Description" source="form.description" />
                <TextField label="Submission created at" source="created_at" />
              </Datagrid>
            </ReferenceManyField>
          </FormTab>
      </TabbedForm>
  </Edit>
);

export const TechieCreate = props => (
  <Create {...props}>
    <SimpleForm>
          <SelectInput source="semester" choices={[
            { id: 'S_2020_01', name: '2020-01' },
            { id: 'S_2020_02', name: '2020-02' },
          ]} />
          <SelectInput source="state" choices={[
            { id: 'PROSPECT', name: 'Prospect' },
            { id: 'APPLICANT', name: 'Applicant' },
            { id: 'REJECTED', name: 'Rejected' },
            { id: 'LEARNER', name: 'Learner' },
            { id: 'DROPPED', name: 'Dropped' },
            { id: 'ALUMNI', name: 'Alumni' },
          ]} />
          <TextInput source="email" />
          <TextInput source="techie_key" />
      </SimpleForm>
  </Create>
);
