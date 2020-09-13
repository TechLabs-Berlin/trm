const log = ({severity, message, fields}) => {
  let event = {
    severity,
    message
  }
  if(typeof fields !== 'undefined') {
    Object.assign(event, fields)
  }
  console.log(JSON.stringify(event))
}

module.exports = ({ debugLoggingEnabled }) => {
  return {
    debug: (message, fields) => {
      if(!debugLoggingEnabled) {
        return
      }
      log({
        severity: 'DEBUG',
        message,
        fields
      })
    },
    info: (message, fields) => {
      log({
        severity: 'INFO',
        message,
        fields
      })
    },
    notice: (message, fields) => {
      log({
        severity: 'NOTICE',
        message,
        fields
      })
    },
    warning: (message, fields) => {
      log({
        severity: 'WARNING',
        message,
        fields
      })
    },
    error: (message, fields) => {
      log({
        severity: 'ERROR',
        message,
        fields
      })
    },
    critical: (message, fields) => {
      log({
        severity: 'CRITICAL',
        message,
        fields
      })
    },
    alert: (message, fields) => {
      log({
        severity: 'ALERT',
        message,
        fields
      })
    },
    emergency: (message, fields) => {
      log({
        severity: 'EMERGENCY',
        message,
        fields
      })
    },
  }
}
