import * as React from "react";
import PropTypes from 'prop-types';

import {
  Chip,
  Avatar,
  makeStyles,
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

export const ActivityField = ({ source, record = {}}) => {
  const classes = useStyles()
  if(!(source in record)) {
    return <React.Fragment />
  }
  return (
    <div>
      {record[source].map(activity => (
        <Chip
          key={activity.type}
          className={classes.chip + ' ' + (activity.value > 0 && classes.chipActive)}
          avatar={<Avatar className={activity.value > 0 ? classes.orange : classes.grey}>{activity.value}</Avatar>}
          label={activity.type}
          variant="outlined"
        />
      ))}
    </div>
  )
}

ActivityField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};
