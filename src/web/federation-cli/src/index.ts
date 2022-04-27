import { Command } from 'commander'

import federatedCommand from './commands/federated'

import { version } from '../package.json'

const program = new Command()

program.version(version).description('Federation Utils CLI').addCommand(federatedCommand).parse(process.argv)
