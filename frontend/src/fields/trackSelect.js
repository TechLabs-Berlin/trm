import * as React from "react";
import PropTypes from 'prop-types';
import { SelectField } from 'react-admin';

export const TrackSelectField = ({ source, record = {}}) => {
  return <SelectField source={source} record={record} choices={[
    { id: 'DS', name: 'Data Science' },
    { id: 'AI', name: 'Artificial Intelligence' },
    { id: 'WEBDEV', name: 'Web Development' },
    { id: 'UX', name: 'User Experience Design' },
  ]} />
}

TrackSelectField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

TrackSelectField.defaultProps = {
  addLabel: true
}
