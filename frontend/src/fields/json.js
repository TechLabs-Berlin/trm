import * as React from "react";
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view'

export const JSONField = ({ source, record = {} }) => {
  return <ReactJson
    src={record[source]}
    collapsed={2}
    collapseStringsAfterLength={60}
  />
}

JSONField.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

JSONField.defaultProps = {
  addLabel: true
}
