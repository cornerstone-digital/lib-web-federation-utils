export type SharedImportMapConfig = {
  imports: {
    addVue: boolean
    addReact: boolean
    addStyledComponents: boolean
  }
  isDev: boolean
  basePath: string
  format: 'umd' | 'esm'
}
