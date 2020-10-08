import * as React from "react";
import PropTypes from 'prop-types'
import { DateField } from 'react-admin'
import moment from 'moment'

const TimestampField = ({ record = {}, source, absolute = true, relative = false }) => {
  if(!(source in record)) {
    return <React.Fragment />
  }
  const date = moment(`${record[source]}Z`)
  return (
    <React.Fragment>
      {absolute && date.format('ddd, MMM D HH:mm:ss')}
      {relative && (
        `${absolute ? ' (' : ''}${date.fromNow()}${absolute ? ')' : ''}`
      )}
    </React.Fragment>
  )
}

export default TimestampField

TimestampField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
  absolute: PropTypes.bool,
  relative: PropTypes.bool
};

TimestampField.defaultProps = {
  addLabel: true
}
