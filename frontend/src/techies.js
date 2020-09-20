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
  NullableBooleanInput,
  Toolbar,
  SaveButton,
  ReferenceField,
  useDataProvider
} from 'react-admin';
import { StateSelectField } from './fields/stateSelect'
import { StateSelectInput } from './inputs/stateSelect'
import { TrackSelectField } from './fields/trackSelect'
import { TrackSelectInput } from './inputs/trackSelect'
import BulkUpdateTechieStateButton from "./components/buttons/bulkUpdateTechieState";
import BulkUpdateAssignedTeamMemberButton from "./components/buttons/bulkUpdateAssignedTeamMember";
import { FormResponseAnswersField } from './fields/formResponseAnswers';

const TechieFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search" source="techie_key" alwaysOn />
      <TextInput source="email" />
      <ReferenceInput label="Semester" source="semester_id" reference="semesters">
        <SelectInput  optionText="description" />
      </ReferenceInput>
      <StateSelectInput source="state" />
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
            <TrackSelectField source="application_track_choice" />
            <ReferenceField label="Assigned Team Member" source="assigned_team_member_id" reference="team_members">
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
              <FormResponseAnswersField record={applicationForm} label="Application Form" />
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
  )
};
