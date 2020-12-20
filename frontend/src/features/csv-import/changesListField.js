import * as React from "react";
import PropTypes from 'prop-types';

export const ChangesListField = ({ record = {}}) => {
  const changes = Object.entries(record.changes).reduce((acc, [attribute, newValue]) => {
    if(!record.attributes) {
      return acc
    }
    let oldValue = <i>None</i>
    if(record.attributes && (attribute in record.attributes)) {
      oldValue = <React.Fragment>{record.attributes[attribute]}</React.Fragment>
    }
    if(newValue === null) {
      newValue = <i>None</i>
    }
    acc.push(<li key={attribute}>{attribute}: {oldValue} → {newValue}</li>)
    return acc
  }, [])
  return (
    <ul>{changes}</ul>
  )
}

ChangesListField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};
