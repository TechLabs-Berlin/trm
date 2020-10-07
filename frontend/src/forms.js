import * as React from "react";
import {
  Filter,
  List,
  Datagrid,
  DateField,
  TextField,
  ReferenceManyField,
  ReferenceInput,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Create,
  Pagination,
  TabbedForm,
  FormTab,
  ReferenceField,
  useDataProvider,
  ListContextProvider
} from 'react-admin';
import {
  Typography
} from '@material-ui/core'
import { FormTypeSelectField } from "./fields/formTypeSelect";
import { RelativeTimeField } from './fields/relativeTime'
import { CountListField } from './fields/countList'
import { TechieField } from './fields/techie'
import { FormTypeSelectInput } from "./inputs/formTypeSelect";

const FormFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search" source="description" alwaysOn />
      <TextInput source="form_id" />
  </Filter>
);

export const FormList = props => (
    <List {...props} filters={<FormFilter />} perPage={25}>
        <Datagrid rowClick="edit">
            <TextField source="description" />
            <ReferenceManyField label="# Responses" reference="form_responses" target="form_id" perPage={1000}>
              <CountListField label="Responses" />
            </ReferenceManyField>
            <TextField source="typeform_id" />
            <FormTypeSelectField source="form_type" />
        </Datagrid>
    </List>
);

const FormTitle = ({ record }) => {
  let title = ''
  if(record && record.description) {
    title = record.description
  } else if(record && record.id) {
    title = record.id
  }
  return <span>Form <strong>{title}</strong></span>;
};

export const FormEdit = props => {
  const dataProvider = useDataProvider()
  const [isPersonalized, setPersonalized] = React.useState(false)
  const [missingTechies, setMissingTechies] = React.useState({})

  React.useEffect(() => {
    const update = async() => {
      if(!props.id) {
        return
      }
      const formResp = await dataProvider.getOne('forms', { id: props.id })
      if(!formResp || !formResp.data || formResp.data.form_type !== 'PERSONALIZED') {
        return
      }
      setPersonalized(true)
      const respondedTechiesResp = await dataProvider.getList('form_responses', {
        filter: { form_id: props.id }
      })
      const respondedTechies = respondedTechiesResp.data.map(t => t.techie.id)
      const techiesResp = await dataProvider.getList('techies', {
        filter: { semester_id: formResp.data.semester_id, state: 'LEARNER' }
      })
      const allTechies = techiesResp.data
      const newMissingTechies = allTechies.filter(t => !respondedTechies.includes(t.id)).reduce((acc, t) => {
        acc[t.id] = t
        return acc
      }, {})
      setMissingTechies(newMissingTechies)
    }
    update()
  }, [props.id, dataProvider])

  return (
    <Edit title={<FormTitle />} {...props}>
        <TabbedForm>
            <FormTab label="Form">
              <ReferenceInput label="Semester" source="semester_id" reference="semesters">
                  <SelectInput optionText="description" />
              </ReferenceInput>
              <TextInput source="typeform_id" />
              <FormTypeSelectInput source="form_type" />
              <TextInput source="description" />
              <DateField source="webhook_installed_at" showTime={true} />
            </FormTab>
            <FormTab label="Responses">
              <ReferenceManyField label="Form Responses" reference="form_responses" target="form_id" pagination={<Pagination />}>
                <Datagrid rowClick="show">
                  <ReferenceField label="Techie" source="techie.id" reference="techies">
                    <TechieField />
                  </ReferenceField>
                  <TextField label="Time" source="created_at" />
                  <RelativeTimeField label="Time ago" source="created_at" />
                </Datagrid>
              </ReferenceManyField>
            </FormTab>
            {isPersonalized && (<FormTab label="Pending Responses">
              <ListContextProvider value={{
                    data: missingTechies,
                    ids: Object.keys(missingTechies),
                    total: Object.keys(missingTechies).length,
                    currentSort: { field: 'id', order: 'ASC' },
                    basePath: "/techies", // TODO remove, but throws an error
                    resource: 'techies', // TODO remove, but throws an error
                    selectedIds: []
                  }}>
                    <Typography variant='body1'>
                      As this is a <i>PERSONALIZED</i> form, we expect all Techies with state <i>LEARNER</i> to submit it eventually.
                      <br/>
                      Below is a list of Techies who didn't respond to this form yet:
                    </Typography>
                    <Datagrid>
                      <ReferenceField label="Techie" source="id" reference="techies" sortable={false}>
                        <TechieField />
                      </ReferenceField>
                    </Datagrid>
                </ListContextProvider >
            </FormTab>)}
        </TabbedForm>
    </Edit>
  )
};

export const FormCreate = props => (
  <Create {...props}>
    <SimpleForm>
          <ReferenceInput label="Semester" source="semester_id" reference="semesters">
              <SelectInput optionText="description" />
          </ReferenceInput>
          <TextInput source="typeform_id" />
          <FormTypeSelectInput source="form_type" />
          <TextInput source="description" />
      </SimpleForm>
  </Create>
);
