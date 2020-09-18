import * as React from "react";
import PropTypes from 'prop-types';
import { SelectInput } from 'react-admin';

export const StateSelectInput = ({ source, record = {}}) => {
  return <SelectInput source={source} record={record} choices={[
    { id: 'PROSPECT', name: 'Prospect' },
    { id: 'APPLICANT', name: 'Applicant' },
    { id: 'REJECTED', name: 'Rejected' },
    { id: 'LEARNER', name: 'Learner' },
    { id: 'DROPPED', name: 'Dropped' },
    { id: 'ALUMNI', name: 'Alumni' },
  ]} />
}

StateSelectInput.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

StateSelectInput.defaultProps = {
  addLabel: true
}
