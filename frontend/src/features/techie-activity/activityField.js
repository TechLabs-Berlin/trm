import * as React from "react";
import PropTypes from 'prop-types';

import {
  useTranslate
} from 'react-admin'

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

const byType = (a, b) => ('' + a.type).localeCompare(b.type)
const transformActivity = ({ type, value }) => {
  if(type !== 'edyoucated') return { type, value }
  return {
    value: (value / 60).toFixed(1),
    type,
  }
}

export const ActivityField = ({ source, record = {}}) => {
  const classes = useStyles()
  const translate = useTranslate()
  if(!(source in record)) {
    return <React.Fragment />
  }
  return (
    <div>
      {record[source].sort(byType).map(transformActivity).map(activity => (
        <Chip
          key={activity.type}
          className={classes.chip + ' ' + (activity.value > 0 && classes.chipActive)}
          avatar={<Avatar className={activity.value > 0 ? classes.orange : classes.grey}>{activity.value}</Avatar>}
          label={translate(`resources.techie_activity.fields.type_values.${activity.type}`)}
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
