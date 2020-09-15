import * as React from "react";
import { Filter, List, Datagrid, EmailField, SelectField, TextField, Edit, SimpleForm, TextInput, SelectInput, Create } from 'react-admin';

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
    <List {...props} filters={<TechieFilter />}>
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
            <TextField source="techie_key" />
            <EmailField source="email" />
        </Datagrid>
    </List>
);

export const TechieEdit = props => (
  <Edit {...props}>
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
