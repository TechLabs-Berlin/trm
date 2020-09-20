import * as React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

export const FormResponseAnswersField = ({ record = {}}) => {
  const sortedAnswers = Object.entries(record.answers)
    .map(([key, answer]) => {return { key, ...answer }})
    .sort((a, b) => {
      if(typeof a.index === 'number' && typeof b.index === 'number') {
        return a.index - b.index
      }
      return 0
    })
  return (
    <List>
      {sortedAnswers.map(({key, ...answer}) => {
        let title = key
        if(answer.title) {
          title = <span>{answer.title} <i>({key})</i></span>
        }

        let text = answer.value
        if(answer.type === 'text') {
          text = answer.value.split('\n').map((item, key) => {
            return <React.Fragment key={key}>{item}<br/></React.Fragment>
          })
        } else if(answer.type === 'choices') {
          text = <ul>{answer.value.map(v => <li>{v}</li>)}</ul>
        } else if(answer.type === 'boolean') {
          if(answer.value) {
            text = 'True'
          } else {
            text = 'False'
          }
        } else if(answer.type === 'email') {
          text = <a href={'mailto:'+answer.value}>{answer.value}</a>
        } else if(answer.type === 'file_url') {
          text = <a href={answer.value}>{answer.value}</a>
        } else if(answer.type === 'url') {
          text = <a href={answer.value}>{answer.value}</a>
        }
        return (
          <ListItem key={key}>
            <ListItemIcon>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary={title} secondary={text} />
          </ListItem>
        )
      })}
    </List>
  )
}

FormResponseAnswersField.defaultProps = {
  addLabel: true
}
