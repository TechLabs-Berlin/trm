import * as React from "react"
import { cloneElement } from 'react'
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  required,
  Show,
  SimpleShowLayout,
  ShowActions,
  SaveButton,
  Toolbar,
  useListContext,
  TopToolbar,
  sanitizeListRestProps,
  CreateButton,
  ExportButton,
  BulkDeleteButton,
} from 'react-admin'

import Alert from '@material-ui/lab/Alert'

import { FunctionalTeamSelectField } from './fields/functionalTeamSelect'
import { FunctionalTeamSelectInput } from './inputs/functionalTeamSelect'

const TeamMemberListActions = (props) => {
  const {
      className,
      exporter,
      filters,
      maxResults,
      permissions,
      ...rest
  } = props;
  const {
      currentSort,
      resource,
      displayedFilters,
      filterValues,
      basePath,
      showFilter,
      total,
  } = useListContext();
  return (
      <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
          {filters && cloneElement(filters, {
              resource,
              showFilter,
              displayedFilters,
              filterValues,
              context: 'button',
          })}
          {permissions.includes('hr') && <CreateButton basePath={basePath} />}
          <ExportButton
              disabled={total === 0}
              resource={resource}
              sort={currentSort}
              filterValues={filterValues}
              maxResults={maxResults}
          />
      </TopToolbar>
  );
};

const TeamMemberBulkActionButtons = ({permissions, ...props}) => (
  <React.Fragment>
      {permissions.includes('hr') && <BulkDeleteButton permissions={permissions} {...props} />}
  </React.Fragment>
);

export const TeamMemberList = props => {
  const { permissions } = props

  const rowClick = () => permissions.includes('hr') ? 'edit' : 'show'

  return (
    <List {...props} actions={<TeamMemberListActions permissions={permissions} />} bulkActionButtons={<TeamMemberBulkActionButtons permissions={permissions} />} perPage={25}>
        <Datagrid rowClick={rowClick}>
            <FunctionalTeamSelectField source="functional_team" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <TextField source="description" />
        </Datagrid>
    </List>
  )
};

const TeamMemberTitle = ({ record }) => {
  if(record && record.first_name && record.last_name) {
    return <span>Team Member <strong>{record.first_name} {record.last_name}</strong></span>
  } else if(record && record.id) {
    return <span>Team Member <strong>{record.id}</strong></span>
  }
  return <span>Team Member</span>;
};

const TeamMemberEditToolbar = props => (
  <Toolbar {...props} >
      <SaveButton />
  </Toolbar>
);


export const TeamMemberShow = ({ permissions, ...props }) => (
  <Show title={<TeamMemberTitle />} actions={permissions.includes('hr') ? <ShowActions /> : null} permissions={permissions} {...props}>
      <SimpleShowLayout>
          <TextField source="first_name" validate={required()} />
          <TextField source="last_name" validate={required()} />
          <TextField source="email" validate={required()} />
          <FunctionalTeamSelectField source="functional_team" />
          <TextField source="description" />
      </SimpleShowLayout>
  </Show>
);

export const TeamMemberEdit = ({ permissions, ...props }) => (
  <Edit title={<TeamMemberTitle />} permissions={permissions} {...props}>
      <SimpleForm toolbar={<TeamMemberEditToolbar />}>
          <TextInput source="first_name" validate={required()} />
          <TextInput source="last_name" validate={required()} />
          <TextInput source="description" />
          {permissions.includes('hr') ?
            <TextInput source="email" validate={required()} /> :
            <TextField source="email" />
          }
          {permissions.includes('hr') ?
            <FunctionalTeamSelectInput source="functional_team" /> :
            <FunctionalTeamSelectField source="functional_team" />
          }
          {!permissions.includes('hr') && <Alert variant="outlined" severity="info">
            Your Functional Team determines your privileges in this tool. Reach out to the local board or HR to change this setting.
          </Alert>}
      </SimpleForm>
  </Edit>
);

export const TeamMemberCreate = props => (
  <Create {...props}>
    <SimpleForm>
          <TextInput source="first_name" validate={required()} />
          <TextInput source="last_name" validate={required()} />
          <TextInput source="description" />
          <TextInput source="email" validate={required()} />
          <FunctionalTeamSelectInput source="functional_team" />
      </SimpleForm>
  </Create>
);
