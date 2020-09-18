import * as React from "react";
import PropTypes from 'prop-types';
import { SelectField } from 'react-admin';

export const StateSelectField = ({ source, record = {}}) => {
  return <SelectField source={source} record={record} choices={[
    { id: 'PROSPECT', name: 'Prospect' },
    { id: 'APPLICANT', name: 'Applicant' },
    { id: 'REJECTED', name: 'Rejected' },
    { id: 'LEARNER', name: 'Learner' },
    { id: 'DROPPED', name: 'Dropped' },
    { id: 'ALUMNI', name: 'Alumni' },
  ]} />
}

StateSelectField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

StateSelectField.defaultProps = {
  addLabel: true
}
