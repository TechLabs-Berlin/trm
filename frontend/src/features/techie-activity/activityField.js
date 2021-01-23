import * as React from "react";
import PropTypes from 'prop-types';
import { property } from 'lodash'

import {
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  large: {
    fontSize: '14pt',
    fontWeight: 'bold',
  }
}))

const DefaultField = ({value}) => {
  return <span>{value}</span>
}

const EdyoucatedField = ({value, isRelative}) => {
  // well...
  // https://stackoverflow.com/a/12830454
  const classes = useStyles()
  const hours = +(value / 60).toFixed(1)
  let displayedValue = hours.toString().split('.')
  return (
    <React.Fragment>
      {isRelative && value > 0 && <span className={classes.large}>+</span>}<span className={classes.large}>{displayedValue[0]}</span>{displayedValue[1] && `.${displayedValue[1]}`}h
    </React.Fragment>
  )
}

export const ActivityField = ({ source, record = {}}) => {
  let value = property(source)(record)
  if(!source.includes('edyoucated')) {
    return <DefaultField value={value} />
  }
  let isRelative = source.endsWith('relative')
  if(isRelative && (typeof value === 'undefined')) {
    isRelative = false
    value = property(source.replace('relative', 'absolute'))(record)
  }
  if(typeof value === 'undefined') {
    return <React.Fragment />
  }
  return <EdyoucatedField value={value} isRelative={isRelative} />
}

ActivityField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};
