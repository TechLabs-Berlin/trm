import * as React from "react";
import PropTypes from 'prop-types';
import { SelectField } from 'react-admin';

export const FormTypeSelectField = ({ source, record = {}}) => {
  return <SelectField source={source} record={record} choices={[
    { id: 'APPLICATION', name: 'Application Form' },
    { id: 'PERSONALIZED', name: 'Personalized Form' },
    { id: 'ANONYMOUS', name: 'Anonymous Form' },
  ]} />
}

FormTypeSelectField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

FormTypeSelectField.defaultProps = {
  addLabel: true
}
