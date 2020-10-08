import * as React from "react";
import {
    Filter,
    List,
    Datagrid,
    TextField,
    ReferenceInput,
    ReferenceField,
    SelectInput,
    Edit,
    TabbedForm,
    FormTab,
    DateField,
    TextInput,
    Toolbar,
    SaveButton
} from 'react-admin';
import { FormResponseAnswersField } from './fields/formResponseAnswers';
import { JSONField } from './fields/json'
import { TechieField } from './fields/techie'
import TimestampField from './fields/timestamp'
import UpdateRecordsButton from './components/buttons/updateRecords'

const FormResponseFilter = (props) => (
  <Filter {...props}>
      <ReferenceInput label="Form" source="form_id" reference="forms">
        <SelectInput  optionText="description" />
      </ReferenceInput>
  </Filter>
)

const FormResponseBulkActionButtons = props => (
  <React.Fragment>
    <UpdateRecordsButton {...props} />
  </React.Fragment>
)

export const FormResponseList = props => (
    <List {...props} filters={<FormResponseFilter />} bulkActionButtons={<FormResponseBulkActionButtons />} perPage={25} sort={{ field: 'created_at', order: 'DESC' }}>
        <Datagrid rowClick="edit">
            <TextField source="form.description" />
            <ReferenceField label="Techie" source="techie.id" reference="techies">
              <TechieField />
            </ReferenceField>
            <TimestampField source="created_at" absolute={false} relative />
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

const transformSave = ({ id, techie_id }) => {
  return {
    id,
    techie_id: !!techie_id ? techie_id : null,
    updated_at: (new Date()).toISOString(),
  }
}

const FormResponseEditToolbar = props => (
  <Toolbar {...props} >
      <SaveButton transform={transformSave} />
  </Toolbar>
)

export const FormResponseEdit = props => (
    <Edit title={<FormResponseTitle /> } undoable={false} {...props}>
        <TabbedForm redirect="edit" toolbar={<FormResponseEditToolbar />}>
            <FormTab label="Answers">
                <ReferenceField label="Form" source="form_id" reference="forms">
                    <TextField source="description" />
                </ReferenceField>
                <ReferenceField label="Techie" source="techie_id" reference="techies">
                  <TechieField />
                </ReferenceField>
                <TextInput source="techie_id" />
                <FormResponseAnswersField label="Answers" />
                <TimestampField source="created_at" relative />
                <TimestampField source="updated_at" relative />
            </FormTab>
            <FormTab label="Details">
                <TextField source="form_id" />
                <TextField source="techie_id" />
                <TextField source="typeform_response_token" />
                <JSONField source="answers" />
                <JSONField source="typeform_event" />
                <TimestampField source="created_at" relative />
                <TimestampField source="updated_at" relative />
          </FormTab>
        </TabbedForm>
  </Edit>
);
