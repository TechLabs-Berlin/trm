import * as React from "react";
import { useState } from "react";
import { Fragment } from 'react';
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
  Toolbar,
  SaveButton,
  ReferenceField,
  useDataProvider,
  NumberInput,
  required,
} from 'react-admin';
import { StateSelectField } from './fields/stateSelect'
import { StateSelectInput } from './inputs/stateSelect'
import { TrackSelectField } from './fields/trackSelect'
import { TrackSelectInput } from './inputs/trackSelect'
import TimestampField from './fields/timestamp'
import BulkUpdateTechieStateButton from "./components/buttons/bulkUpdateTechieState";
import BulkUpdateAssignedTeamMemberButton from "./components/buttons/bulkUpdateAssignedTeamMember";
import { FormResponseAnswersField } from './fields/formResponseAnswers';

const TechieFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search by Last Name" source="last_name" alwaysOn />
      <TextInput label="Search by Techie Key" source="techie_key" alwaysOn />
      <TextInput source="email" />
      <TextInput source="first_name" />
      <ReferenceInput label="Semester" source="semester_id" reference="semesters">
        <SelectInput  optionText="description" />
      </ReferenceInput>
      <ReferenceInput label="Assigned Team Member" source="assigned_team_member_id" reference="team_members">
        <SelectInput optionText="first_name" />
      </ReferenceInput>
      <StateSelectInput source="state" />
      <TrackSelectInput source="track" />
      <TrackSelectInput source="application_track_choice" />
  </Filter>
);

const TechieBulkActionButtons = props => (
  <Fragment>
    <BulkUpdateTechieStateButton {...props} />
    <BulkUpdateAssignedTeamMemberButton {...props} />
  </Fragment>
)

export const TechieList = props => (
  <List {...props} bulkActionButtons={<TechieBulkActionButtons />} filters={<TechieFilter />} perPage={25}>
    <Datagrid rowClick="edit">
        <StateSelectField source="state" />
        <TextField source="first_name" />
        <TextField source="last_name" />
        <TextField source="techie_key" />
        <TrackSelectField source="track" />
        <ReferenceField label="Assigned Team Member" source="assigned_team_member_id" reference="team_members" link="show">
          <TextField source="first_name" />
        </ReferenceField>
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

export const TechieEdit = props => {
  const [applicationForm, setApplicationForm] = useState({answers: []})
  const dataProvider = useDataProvider()
  if(applicationForm.answers.length === 0) {
    dataProvider.getManyReference('form_responses', { target: 'techie_id', id: props.id })
                .then(({data}) => {
                  const result = data.find(response => response.form.form_type === 'APPLICATION')
                  if(result) {
                    setApplicationForm(result)
                  }
                })
  }

  return (
    <Edit undoable={false} title={<TechieTitle />} {...props}>
        <TabbedForm redirect="edit" toolbar={<TechieEditToolbar />}>
            <FormTab label="Master Data">
              <ReferenceInput label="Semester" source="semester_id" reference="semesters">
                  <SelectInput optionText="description" validate={required()} />
              </ReferenceInput>
              <StateSelectInput source="state" validate={required()} />
              <TextInput source="first_name" />
              <TextInput source="last_name" />
              <SelectInput source="gender" allowEmpty={true} choices={[
                { id: 'male', name: 'Male' },
                { id: 'female', name: 'Female' }
              ]} />
              <NumberInput source="age" />
              <TextInput source="email" />
              <TrackSelectField source="application_track_choice" />
              <ReferenceInput label="Assigned Team Member" source="assigned_team_member_id" reference="team_members" allowEmpty={true}>
                  <SelectInput optionText={(record) => `${record.first_name} ${record.last_name}`} />
              </ReferenceInput>
              <TextInput multiline source="notes" />
              <TextInput source="google_account" />
              <TextInput source="github_handle" />
              <TextField source="edyoucated_user_id" />
              <TextInput source="linkedin_profile_url" />
              <TextInput source="slack_member_id" />
              <TextField source="id" />
              <TextField source="techie_key" />
              <TimestampField source="edyoucated_imported_at" relative />
              <TimestampField source="edyoucated_next_import_after" relative />
              <TimestampField source="created_at" relative />
              <TimestampField source="updated_at" relative />
            </FormTab>
            <FormTab label="Application">
              <FormResponseAnswersField record={applicationForm} label="Application Form" />
            </FormTab>
            <FormTab label="Academy">
              <TrackSelectInput source="track" />
            </FormTab>
            <FormTab label="Form Submissions">
              <ReferenceManyField label="Form Responses by Techie" reference="form_responses" target="techie_id">
                <Datagrid rowClick="edit">
                  <TextField label="Form Description" source="form.description" />
                  <TextField label="Submission created at" source="created_at" />
                </Datagrid>
              </ReferenceManyField>
            </FormTab>
        </TabbedForm>
    </Edit>
  )
};
