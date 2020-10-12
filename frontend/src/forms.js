import * as React from "react";
import {
  Filter,
  List,
  Datagrid,
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
  ListContextProvider,
  downloadCSV,
  Toolbar,
  SaveButton,
  DeleteButton,
  useTranslate,
  regex,
  required
} from 'react-admin';
import jsonExport from 'jsonexport/dist'
import { pick } from 'lodash'
import {
  Typography,
  Grid,
  Button,
  makeStyles
} from '@material-ui/core'
import { FormTypeSelectField } from "./fields/formTypeSelect";
import { CountListField } from './fields/countList'
import { TechieField } from './fields/techie'
import TimestampField from './fields/timestamp'
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
}

const transformSave = ({ updated_at, ...rest }) => {
  return {
    updated_at: (new Date()).toISOString(),
    ...rest
  }
}

const FormEditToolbar = props => {
  const classes = useStyles()
  return (
    <Toolbar {...props} >
        <SaveButton transform={transformSave} />
        <div className={classes.grow} />
        <DeleteButton />
    </Toolbar>
  )
}

const useStyles = makeStyles({
  grow: {
    flexGrow: 1
  }
})

const validateTypeformID = [required(), regex(/^[a-zA-Z0-9]{8,}$/, 'Must be a valid Typeform ID')]

export const FormEdit = props => {
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const [isPersonalized, setPersonalized] = React.useState(false)
  const [missingTechies, setMissingTechies] = React.useState({})
  const [respondedTechies, setRespondedTechies] = React.useState(0)

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
      const respondedTechies = respondedTechiesResp.data.filter(t => !!t.techie).map(t => t.techie.id)
      const techiesResp = await dataProvider.getList('techies', {
        filter: { semester_id: formResp.data.semester_id, state: 'LEARNER' }
      })
      const allTechies = techiesResp.data
      const newMissingTechies = allTechies.filter(t => !respondedTechies.includes(t.id)).reduce((acc, t) => {
        acc[t.id] = t
        return acc
      }, {})
      setMissingTechies(newMissingTechies)
      setRespondedTechies(respondedTechies.length)
    }
    update()
  }, [props.id, dataProvider])

  const exportMissingTechies = () => {
    const data = Object.values(missingTechies).map(t => pick(t, ['email', 'techie_key', 'first_name', 'last_name']))
    jsonExport(
      data, (err, csv) => {
        downloadCSV(csv, 'missing_techies.csv')
      }
    )
  }

  return (
    <Edit title={<FormTitle />} undoable={false} {...props}>
        <TabbedForm redirect="edit" toolbar={<FormEditToolbar />}>
            <FormTab label="Form">
              <ReferenceInput label="Semester" source="semester_id" reference="semesters">
                  <SelectInput optionText="description" validate={required()} />
              </ReferenceInput>
              <TextInput source="typeform_id" validate={validateTypeformID} helperText={translate('resources.forms.helper_texts.form_id')} />
              <FormTypeSelectInput source="form_type" validate={required()} />
              <TextInput source="description" validate={required()} />
              <TimestampField source="webhook_installed_at" relative />
              <TimestampField source="created_at" relative />
              <TimestampField source="updated_at" relative />
            </FormTab>
            <FormTab label={`Responses (${respondedTechies})`}>
              <ReferenceManyField label="Form Responses" reference="form_responses" target="form_id" pagination={<Pagination />} sort={{field: 'created_at', order: 'DESC'}}>
                <Datagrid rowClick="edit">
                  <ReferenceField label="Techie" source="techie.id" reference="techies">
                    <TechieField />
                  </ReferenceField>
                  <TimestampField label="Time ago" source="created_at" absolute={false} relative />
                </Datagrid>
              </ReferenceManyField>
            </FormTab>
            {isPersonalized && (<FormTab label={`Pending Responses (${Object.keys(missingTechies).length})`}>
              <ListContextProvider value={{
                    data: missingTechies,
                    ids: Object.keys(missingTechies),
                    total: Object.keys(missingTechies).length,
                    currentSort: { field: 'id', order: 'ASC' },
                    basePath: "/techies", // TODO remove, but throws an error
                    resource: 'techies', // TODO remove, but throws an error
                    selectedIds: []
                  }}>
                    <Grid container justify="space-between">
                      <Grid item>
                        <Typography variant='body1'>
                          As this is a <i>PERSONALIZED</i> form, we expect all Techies with state <i>LEARNER</i> to submit it eventually.
                          <br/>
                          Below is a list of <strong>{Object.keys(missingTechies).length} Techies</strong> who didn't respond to this form yet:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" color="primary" onClick={exportMissingTechies}>
                          Export
                        </Button>
                      </Grid>
                    </Grid>

                    <Datagrid>
                      <ReferenceField label="Techie" source="id" reference="techies" sortable={false}>
                        <TechieField />
                      </ReferenceField>
                      <TextField source="email" />
                      <TextField source="techie_key" />
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
              <SelectInput optionText="description" validate={required()} />
          </ReferenceInput>
          <TextInput source="typeform_id" validate={validateTypeformID} />
          <FormTypeSelectInput source="form_type" validate={required()} />
          <TextInput source="description" validate={required()} />
      </SimpleForm>
  </Create>
);
