import * as React from "react";
import PropTypes from 'prop-types';

import {
  useListContext
} from 'react-admin'

import {
  Chip,
  Avatar,
  makeStyles
} from '@material-ui/core'

import {
  deepPurple,
  grey
} from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
  orange: {
    color: 'white !important',
    backgroundColor: deepPurple[500],
  },
  grey: {
    backgroundColor: grey[200]
  },
  chip: {
    margin: theme.spacing(0.5),
    borderColor: grey[300]
  },
  chipActive: {
    borderColor: deepPurple[500]
  }
}))

export const CountListField = ({ label }) => {
  const { ids } = useListContext()
  const classes = useStyles()
  let count = 0
  if(ids) {
    count = ids.length
  }
  return (
    <Chip
      avatar={<Avatar className={count > 0 ? classes.orange : classes.grey}>{count}</Avatar>}
      className={classes.chip + ' ' + (count > 0 && classes.chipActive)}
      label={label}
      variant="outlined"
    />
  )
}

CountListField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object
}

CountListField.defaultProps = {
  addLabel: true
}
