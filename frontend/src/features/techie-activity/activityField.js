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

const DefaultField = ({data}) => {
  return <span>{data.value}</span>
}

const EdyoucatedField = ({data}) => {
  // well...
  // https://stackoverflow.com/a/12830454
  const classes = useStyles()
  const hours = +(data.value / 60).toFixed(1)
  const parts = hours.toString().split('.')
  return <React.Fragment>
    {!data.absolute && <span className={classes.large}>+</span>}<span className={classes.large}>{parts[0]}</span>{parts[1] && `.${parts[1]}`}h
  </React.Fragment>
}

export const ActivityField = ({ source, record = {}}) => {
  const data = property(source)(record)
  if(!data) {
    return <React.Fragment />
  }
  if(data.type !== 'edyoucated') {
    return <DefaultField data={data} />
  }
  return <EdyoucatedField data={data} />
}

ActivityField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};
