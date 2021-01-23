const _ = require('lodash')

const locationSchemes = {
  BARCELONA: 'BCN',
  DUESSELDORF: 'DUS',
  BERLIN: 'BER',
  DORTMUND: 'DTM',
  COPENHAGEN: 'CPH',
  MUNICH: 'MUC',
  MUENSTER: 'FMO',
  CURITIBA: 'CWB',
  AACHEN: 'MST',
  MEDELLIN: 'MDE',
  HAMBURG: 'HAM',
  PLAYGROUND: 'PLAY',
  GLOBAL: 'GBL',
  CODEATHOME: 'CAH',
  MANNHEIM: 'MHG',
  STOCKHOLM: 'ARN',
  LONDON: 'LHR',
}

module.exports = {
  generateTechieKey: ({ location }) => {
    const scheme = locationSchemes[location]
    if(!scheme) {
      throw new Error(`Location ${location} does not have an assigned scheme`)
    }
    const number = _.random(0, 16777215) // 0 to 0xFFFFFF
    const hexStr = number.toString(16).toUpperCase() // convert to hex without 0x
    return `${scheme.toUpperCase()}://${hexStr}`
  }
}
