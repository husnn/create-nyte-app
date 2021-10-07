#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './init';
import inquirer from 'inquirer';
const program = new Command();

program.command('init').action(() => {
	init(inquirer);
});

program.parse(process.argv);
