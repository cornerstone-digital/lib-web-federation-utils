import { Command } from 'commander'
import actions from './actions'

const federatedCommand = new Command('federated')

/*
 * Compile federated
 */
federatedCommand.command('compile').description('Compiles one or more federated components').action(actions.compileApps)

/*
 * Start federated
 */
// federatedCommand.command('start').description('Starts one or more federated components').action(actions.startApps)

export default federatedCommand
