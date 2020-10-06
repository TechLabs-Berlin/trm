import * as React from "react";
import PropTypes from 'prop-types';

import {
  Badge
} from '@material-ui/core'

export const TechieField = ({ record = {} }) => {
  return (
    <React.Fragment>
      <Badge badgeContent={record.track} color="primary" anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
          {record.first_name} {record.last_name} {record.email}
      </Badge>
    </React.Fragment>
  )
}

TechieField.propTypes = {
  record: PropTypes.object,
}
