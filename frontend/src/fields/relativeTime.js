import * as React from "react";
import PropTypes from 'prop-types';
import Moment from 'react-moment';

export const RelativeTimeField = ({ source, record = {} }) => {
  return <Moment fromNow>{record[source]}</Moment>
}

RelativeTimeField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

RelativeTimeField.defaultProps = {
addLabel: true
}
