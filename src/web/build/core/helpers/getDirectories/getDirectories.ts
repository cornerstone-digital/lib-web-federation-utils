import { Dirent, readdirSync } from 'fs'

const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent: Dirent) => dirent.isDirectory())
    .map(dirent => dirent.name)

export default getDirectories
