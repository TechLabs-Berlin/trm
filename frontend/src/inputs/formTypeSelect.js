import * as React from "react"
import PropTypes from 'prop-types'
import { SelectInput } from 'react-admin'

export const FormTypeSelectInput = ({ source, record = {}, ...rest}) => {
  return <SelectInput source={source} record={record} choices={[
    { id: 'APPLICATION', name: 'Application Form' },
    { id: 'PERSONALIZED', name: 'Personalized Form' },
    { id: 'ANONYMOUS', name: 'Anonymous Form' },
  ]} {...rest} />
}

FormTypeSelectInput.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
}
