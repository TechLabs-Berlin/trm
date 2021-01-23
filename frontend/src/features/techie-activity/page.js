import * as React from "react"

import {
  Datagrid,
  Filter,
  List,
  ReferenceInput,
  SelectInput,
  useListContext,
  ReferenceField,
} from 'react-admin'

import { TechieField } from '../../fields/techie'
import { ActivityField } from './activityField'

const ReportFilter = props => (
  <Filter {...props}>
    <ReferenceInput label="Semester" source="semester_id" reference="semesters" alwaysOn>
      <SelectInput optionText="description" />
    </ReferenceInput>
    <SelectInput source="primary_type" choices={[
      { id: 'edyoucated.value.relative', name: 'Learned Hours on edyoucated (week over week)' },
      { id: 'edyoucated.value.absolute', name: 'Learned Hours on edyoucated (absolute hours)' },
      { id: 'slack_activity.value', name: 'Read Slack?' },
      { id: 'slack_participation.value', name: 'Participated on Slack?' },
    ]} allowEmpty={false} alwaysOn />
  </Filter>
)

export const ReportDynamicDatagrid = props => {
  const {
      data,
      ids,
      loaded,
      total,
      filterValues
  } = useListContext(props)

  const {
    primary_type
  } = filterValues

  if(!loaded) {
    return <React.Fragment>Loading...</React.Fragment>
  }

  if(total <= 0 || data[ids[0]].weeks.length <= 0) {
    return null
  }

  const fields = [
    <ReferenceField source="id" reference="techies">
      <TechieField />
    </ReferenceField>,
    ...data[ids[0]].weeks.map(week => (
      <ActivityField source={`${week}.${primary_type}`} label={week} />
    ))
  ]

  return (
    <Datagrid children={fields} />
  )
}

export const TechieActivityReportList = props => (
  <List {...props} empty={false} filters={<ReportFilter />} filterDefaultValues={{primary_type: 'edyoucated.value.relative'}} pagination={null}>
    <ReportDynamicDatagrid />
  </List>
)
