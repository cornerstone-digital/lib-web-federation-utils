type CreateShareModuleOptions = {
  name: string
  scope: string
  methods: object
}

const createSharedModule = ({
  name,
  scope,
  methods,
}: CreateShareModuleOptions) => {
  return {
    type: 'shared-module',
    scope,
    name,
    methods,
  }
}

export default createSharedModule
