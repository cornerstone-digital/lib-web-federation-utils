import compile from '../vite.config'
import { build } from 'vite'
import fs from 'fs'
const rewriteManifest = () => {
  const imports: Record<string, string> = {}
  const files = fs.readdirSync('./dist')
  files.forEach((file) => {
    if (file.endsWith('.es.js')) {
      const name = file.replace('.es.js', '')
      imports[name] = `http://localhost:8001/${name}.es.js`
    }
  })

  return { imports }
}

;(async () => {
  if (fs.existsSync('./dist')) fs.rmdirSync('./dist', { recursive: true })
  const lib = [
    {
      fileName: 'ReactFederatedJourney',
      entry: './src/index.tsx',
      name: 'ReactFederatedJourney',
    },
  ]
  lib.forEach(async (item) => {
    await build({
      ...compile,
      build: { ...compile.build, lib: item },
    })
    const imports = rewriteManifest()
    fs.writeFileSync(
      './dist/entries-import-map.json',
      JSON.stringify(imports, null, 2)
    )
  })
})()
