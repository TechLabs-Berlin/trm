import * as React from "react"
import PropTypes from 'prop-types'
import { SelectInput } from 'react-admin'

export const TermSelectInput = ({ source, record = {}, ...rest}) => {
  return <SelectInput source={source} record={record} choices={[
    { id: '2020_01', name: '2020-01 (Summer)' },
    { id: '2020_02', name: '2020-02 (Winter)' },
    { id: '2021_01', name: '2021-01 (Summer)' },
    { id: '2021_02', name: '2021-02 (Winter)' },
    { id: '2022_01', name: '2022-01 (Summer)' },
    { id: '2022_02', name: '2022-02 (Winter)' },
  ]} {...rest} />
}

TermSelectInput.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
}
