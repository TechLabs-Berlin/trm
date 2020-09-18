import * as React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

export const FormSubmissionAnswersField = ({ record = {}}) => {
  return (
    <List>
      {Object.entries(record.answers).map(([key, answer]) => {
        return (
          <ListItem key={key}>
            <ListItemIcon>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary={key} secondary={<span>{answer.value}</span>} />
          </ListItem>
        )
      })}
    </List>
  )
}

FormSubmissionAnswersField.defaultProps = {
  addLabel: true
}
