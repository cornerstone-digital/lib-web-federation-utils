type CreateSharedModuleOptions = {
  name: string
  scope: string
  methods: object
}

const createSharedModule = ({
  name,
  scope,
  methods,
}: CreateSharedModuleOptions) => {
  return {
    type: 'shared-module',
    scope,
    name,
    methods,
  }
}

export default createSharedModule
