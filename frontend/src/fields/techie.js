import * as React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core'

import { ReactComponent as DSTrackLogo } from '../static/track-ds.svg';
import { ReactComponent as AITrackLogo } from '../static/track-ai.svg';
import { ReactComponent as WebDevTrackLogo } from '../static/track-webdev.svg';
import { ReactComponent as UXTrackLogo } from '../static/track-ux.svg';

const useStyles = makeStyles(theme => ({
  logoSpacer: {
    display: 'inline-block',
    width: '30px',
    verticalAlign: 'middle'
  },
  logo: {
    width: '20px',
    marginLeft: theme.spacing(0.5)
  }
}))

const TrackLogo = ({ track }) => {
  const classes = useStyles()
  if(!track) {
    return <React.Fragment />
  }
  switch(track) {
    case 'DS':
      return <DSTrackLogo className={classes.logo} />
      break
    case 'AI':
      return <AITrackLogo className={classes.logo} />
      break
    case 'WEBDEV':
      return <WebDevTrackLogo className={classes.logo} />
      break
    case 'UX':
      return <UXTrackLogo className={classes.logo} />
      break
  }
}

export const TechieField = ({ record = {} }) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      {record.track && (<div className={classes.logoSpacer}>
        <TrackLogo track={record.track} />
      </div>)}
      {record.first_name && record.last_name ? `${record.first_name} ${record.last_name}` : record.email}
    </React.Fragment>
  )
}

TechieField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object
}

TechieField.defaultProps = {
  addLabel: true
}
