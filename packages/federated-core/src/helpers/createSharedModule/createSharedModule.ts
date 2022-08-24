type CreateSharedModuleOptions = {
  name: string
  scope: string
  basePath?: string
  methods: object
}

const createSharedModule = ({
  name,
  scope,
  basePath,
  methods,
}: CreateSharedModuleOptions) => {
  return {
    type: 'shared-module',
    scope,
    name,
    basePath,
    methods,
  }
}

export default createSharedModule
