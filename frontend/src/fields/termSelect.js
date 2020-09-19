import * as React from "react";
import PropTypes from 'prop-types';
import { SelectField } from 'react-admin';

export const TermSelectField = ({ source, record = {}}) => {
  return <SelectField source={source} record={record} choices={[
    { id: '2020_01', name: '2020-01 (Summer)' },
    { id: '2020_02', name: '2020-02 (Winter)' },
    { id: '2021_01', name: '2021-01 (Summer)' },
  ]} />
}

TermSelectField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

TermSelectField.defaultProps = {
  addLabel: true
}
