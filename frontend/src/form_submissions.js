import * as React from "react";
import {
    Filter,
    List,
    Datagrid,
    TextField,
    TextInput,
    Show,
    SimpleShowLayout,
    TabbedForm,
    FormTab,
    DateField
} from 'react-admin';
import { FormSubmissionAnswersField } from './fields/formSubmissionAnswers';
import { JSONField } from './fields/json'
import { RelativeTimeField } from './fields/relativeTime'

const FormSubmissionFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search by form_id" source="form_id" alwaysOn />
      <TextInput source="typeform_response_token" />
  </Filter>
);

export const FormSubmissionList = props => (
    <List {...props} filters={<FormSubmissionFilter />} perPage={25} sort={{ field: 'created_at', order: 'DESC' }}>
        <Datagrid rowClick="show">
            <TextField source="form.description" />
            <TextField source="techie.first_name" />
            <TextField source="techie.last_name" />
            <RelativeTimeField source="created_at" />
        </Datagrid>
    </List>
);

export const FormSubmissionShow = props => (
  <Show {...props}>
      <SimpleShowLayout>
        <TabbedForm toolbar={null}>
            <FormTab label="Answers">
                <DateField source="created_at" showTime={true}/>
                <FormSubmissionAnswersField label="Answers" />
            </FormTab>
            <FormTab label="Details">
                <TextField source="form_id" />
                <TextField source="techie_id" />
                <TextField source="typeform_response_token" />
                <JSONField source="answers" />
                <JSONField source="typeform_event" />
                <DateField source="created_at" showTime={true}/>
          </FormTab>
        </TabbedForm>
      </SimpleShowLayout>
  </Show>
);
