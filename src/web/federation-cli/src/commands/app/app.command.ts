import { Command } from 'commander'
import actions from './actions'

const appCommand = new Command('app')

/*
 * Compile federated
 */
appCommand.command('compile').description('Compiles one or more federated components').action(actions.compileApps)

/*
 * Start federated
 */
// federatedCommand.command('start').description('Starts one or more federated components').action(actions.startApps)

export default appCommand
