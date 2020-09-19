import * as React from "react";
import PropTypes from 'prop-types';
import { SelectInput } from 'react-admin';

export const FormTypeSelectInput = ({ source, record = {}}) => {
  return <SelectInput source={source} record={record} choices={[
    { id: 'APPLICATION', name: 'Application Form' },
    { id: 'PERSONALIZED', name: 'Personalized Form' },
    { id: 'ANONYMOUS', name: 'Anonymous Form' },
  ]} />
}

FormTypeSelectInput.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

FormTypeSelectInput.defaultProps = {
  addLabel: true
}
