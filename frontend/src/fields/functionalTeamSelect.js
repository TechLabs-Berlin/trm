import * as React from "react";
import PropTypes from 'prop-types';
import { SelectField } from 'react-admin';

export const FunctionalTeamSelectField = ({ source, record = {}}) => {
  return <SelectField source={source} record={record} choices={[
    { id: 'BOARD', name: 'Board' },
    { id: 'IT_ADMIN', name: 'IT Administration' },
    { id: 'JOURNEY', name: 'Journey' },
    { id: 'HR', name: 'Human Resources' },
    { id: 'FINANCE', name: 'Finance & Legal' },
    { id: 'MARKETING', name: 'Marketing' },
    { id: 'PARTNERSHIPS', name: 'Partnerships' },
    { id: 'BIZDEV', name: 'Business Development' },
    { id: 'WEBSITE', name: 'Website' },
    { id: 'REMOTE_PROGRAM', name: 'Remote Program' },
    { id: 'CURRICULUM', name: 'Curriculum' },
    { id: 'LAW', name: 'Law' },
    { id: 'SPECIAL_EVENTS', name: 'Special Events' },
    { id: 'DATA_ANALYTICS', name: 'Data Analytics' },
  ]} />
}

FunctionalTeamSelectField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

FunctionalTeamSelectField.defaultProps = {
  addLabel: true
}
