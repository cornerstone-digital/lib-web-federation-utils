type CreateSharedModuleOptions = {
  name: string
  basePath?: string
  methods: object
}

const createSharedModule = ({
  name,
  basePath,
  methods,
}: CreateSharedModuleOptions) => {
  return {
    type: 'shared-module',
    name,
    basePath,
    methods,
  }
}

export default createSharedModule
