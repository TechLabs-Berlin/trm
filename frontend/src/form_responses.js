import * as React from "react";
import {
    Filter,
    List,
    Datagrid,
    TextField,
    TextInput,
    ReferenceField,
    Show,
    SimpleShowLayout,
    TabbedForm,
    FormTab,
    DateField
} from 'react-admin';
import { FormResponseAnswersField } from './fields/formResponseAnswers';
import { JSONField } from './fields/json'
import { RelativeTimeField } from './fields/relativeTime'

const FormResponseFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search by typeform_id" source="typeform_id" alwaysOn />
      <TextInput source="typeform_response_token" />
  </Filter>
);

export const FormResponseList = props => (
    <List {...props} filters={<FormResponseFilter />} perPage={25} sort={{ field: 'created_at', order: 'DESC' }}>
        <Datagrid rowClick="show">
            <TextField source="form.description" />
            <TextField source="techie.first_name" />
            <TextField source="techie.last_name" />
            <RelativeTimeField source="created_at" />
        </Datagrid>
    </List>
);

const FormResponseTitle = ({ record }) => {
    if(record && record.form && record.form.description) {
      return <span>Form Response to Form <strong>{record.form.description}</strong></span>
    } else if(record && record.id) {
      return <span>Form Response <strong>{record.id}</strong></span>
    }
    return <span>Form Response</span>;
};

export const FormResponseShow = props => (
    <Show title={<FormResponseTitle /> } {...props}>
      <SimpleShowLayout>
        <TabbedForm toolbar={null}>
            <FormTab label="Answers">
                <ReferenceField label="Form" source="form_id" reference="forms">
                    <TextField source="description" />
                </ReferenceField>
                <DateField source="created_at" showTime={true} />
                <FormResponseAnswersField label="Answers" />
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
