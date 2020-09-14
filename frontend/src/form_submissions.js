import * as React from "react";
import { Filter, List, Datagrid, TextField, TextInput, Show, SimpleShowLayout, DateField } from 'react-admin';

const FormSubmissionFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search by form_id" source="form_id" alwaysOn />
      <TextInput source="typeform_response_token" />
  </Filter>
);

export const FormSubmissionList = props => (
    <List {...props} filters={<FormSubmissionFilter />}>
        <Datagrid rowClick="show">
            <TextField source="answers" />
            <DateField source="created_at" showTime={true} />
            <TextField source="form_id" />
            <TextField source="techie_id" />
            <TextField source="typeform_response_token" />
        </Datagrid>
    </List>
);

export const FormSubmissionShow = props => (
  <Show {...props}>
      <SimpleShowLayout>
          <TextField source="form_id" />
          <TextField source="techie_id" />
          <TextField source="typeform_response_token" />
          <TextField source="typeform_event" />
          <TextField source="answers" />
          <DateField source="created_at" showTime={true}/>
      </SimpleShowLayout>
  </Show>
);
