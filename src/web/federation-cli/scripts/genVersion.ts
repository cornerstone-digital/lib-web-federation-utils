import fs from 'fs'

const getVersion = () => {
  const { version } = require('../package.json')
  return version
}

fs.writeFileSync('./src/version.ts', `export const version = '${getVersion()}';`, 'utf8')
