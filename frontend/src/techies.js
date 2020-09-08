import * as React from "react";
import { Filter, List, Datagrid, EmailField, SelectField, Edit, SimpleForm, TextInput, SelectInput, Create } from 'react-admin';

const TechieFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search" source="email" alwaysOn />
      <SelectInput source="location" choices={[
                  { id: 'BERLIN', name: 'Berlin' },
                ]} />
      <SelectInput source="semester" choices={[
        { id: 'S_2020_01', name: '2020-01' },
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
            <EmailField source="email" />
            <SelectField source="location" choices={[
                  { id: 'BERLIN', name: 'Berlin' },
                ]} />
            <SelectField source="semester" choices={[
              { id: 'S_2020_01', name: '2020-01' },
            ]} />
            <SelectField source="state" choices={[
              { id: 'PROSPECT', name: 'Prospect' },
              { id: 'APPLICANT', name: 'Applicant' },
              { id: 'REJECTED', name: 'Rejected' },
              { id: 'LEARNER', name: 'Learner' },
              { id: 'DROPPED', name: 'Dropped' },
              { id: 'ALUMNI', name: 'Alumni' },
            ]} />
        </Datagrid>
    </List>
);

export const TechieEdit = props => (
  <Edit {...props}>
      <SimpleForm>
          <SelectInput source="location" choices={[
            { id: 'BERLIN', name: 'Berlin' },
          ]} />
          <SelectInput source="semester" choices={[
            { id: 'S_2020_01', name: '2020-01' },
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
      </SimpleForm>
  </Edit>
);

export const TechieCreate = props => (
  <Create {...props}>
    <SimpleForm>
          <SelectInput source="location" choices={[
                  { id: 'BERLIN', name: 'Berlin' },
                ]} />
          <SelectInput source="semester" choices={[
            { id: 'S_2020_01', name: '2020-01' },
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
      </SimpleForm>
  </Create>
);
