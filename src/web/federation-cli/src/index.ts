#!/usr/bin/env ts-node

import { Command } from 'commander'

import appCommand from './commands/app'

import { version } from './version'

const program = new Command()

program.version(version).description('Federation Utils CLI').addCommand(appCommand).parse(process.argv)
