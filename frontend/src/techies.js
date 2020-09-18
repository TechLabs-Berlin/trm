import * as React from "react";
import {
  Filter,
  List,
  Datagrid,
  TextField,
  Edit,
  TabbedForm,
  FormTab,
  ReferenceManyField,
  TextInput,
  SelectInput,
  ReferenceInput,
  NullableBooleanInput,
  Toolbar,
  SaveButton
} from 'react-admin';
import { StateSelectField } from './fields/stateSelect'
import { StateSelectInput } from './inputs/stateSelect'
import { TrackSelectField } from './fields/trackSelect'
import { TrackSelectInput } from './inputs/trackSelect'

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
            <StateSelectField source="state" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <TrackSelectField source="application_track_choice" />
        </Datagrid>
    </List>
);

const TechieEditToolbar = props => (
  <Toolbar {...props} >
      <SaveButton />
  </Toolbar>
);

const TechieTitle = ({ record }) => {
  let title = ''
  if(record && record.first_name && record.last_name) {
    title = record.first_name + ' ' + record.last_name
  } else if(record && record.techie_key) {
    title = record.techie_key
  } else if(record && record.id) {
    title = record.id
  }
  return <span>Techie <strong>{title}</strong></span>;
};

export const TechieEdit = props => (
  <Edit title={<TechieTitle />} {...props}>
      <TabbedForm toolbar={<TechieEditToolbar />}>
          <FormTab label="Master Data">
            <ReferenceInput label="Semester" source="semester_id" reference="semesters">
                <SelectInput optionText="description" />
            </ReferenceInput>
            <StateSelectInput source="state" />
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <TextInput source="email" />
            <TextField source="techie_key" />
          </FormTab>
          <FormTab label="Application">
            <TrackSelectField source="application_track_choice" />
            <ReferenceInput label="Assigned Team Member" source="assigned_team_member_id" reference="team_members">
                <SelectInput optionText={(record) => `${record.first_name} ${record.last_name}`} />
            </ReferenceInput>
            <NullableBooleanInput source="application_successful" displayNull />
            <TextInput multiline source="notes" />
          </FormTab>
          <FormTab label="Academy">
            <TrackSelectInput source="track" />
          </FormTab>
          <FormTab label="Form Submissions">
            <ReferenceManyField label="Form Responses by Techie" reference="form_responses" target="techie_id">
              <Datagrid rowClick="show">
                <TextField label="Form Description" source="form.description" />
                <TextField label="Submission created at" source="created_at" />
              </Datagrid>
            </ReferenceManyField>
          </FormTab>
      </TabbedForm>
  </Edit>
);
