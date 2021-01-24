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
  generateTechieKey: ({ location, prefix }) => {
    const scheme = locationSchemes[location]
    if(!scheme) {
      throw new Error(`Location ${location} does not have an assigned scheme`)
    }
    let keyConfig = {
      length: 6,
      max: 16777215, // 0 to 0xFFFFFF
    }
    if(prefix) {
      keyConfig = {
        length: 3,
        max: 65535, // 0 to 0xFFFF
      }
    }
    const number = _.random(0, keyConfig.max)
    const hexStr = number.toString(16).toUpperCase() // convert to hex without 0x
    const hexStrPadded = hexStr.padStart(keyConfig.length, '0')
    return `${scheme.toUpperCase()}://${prefix ? prefix + '/' : ''}${hexStr}`
  }
}
