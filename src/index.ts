#!/usr/bin/env node

import { program } from "commander";
import { addModuleCommand, getModuleListCommand, updateModuleCommand } from "./commands/commands";
import { getEnvVariables } from "./utils/utils";
import chalk from "chalk";
export const baseUrl = getEnvVariables()["UPDATE_BASE_URL"];
export const secretKey: string = getEnvVariables()["USER_SECRET_KEY"];
export const prefix = `[${chalk.yellow('DynastyCLI')}]`


program
  .version("1.0.0")
  .name("DynastyCLI")
  .description("CLI tool for DynastyCore")


const moduleCmd = program.command('module');

moduleCmd.command('update')
  .description('Update a module')
  .argument('<module_name>', 'Module ID to update')
  .action((module_name) => updateModuleCommand(module_name))

moduleCmd.command('add')
  .description('Add a new module')
  .argument('<module_name>', 'Module ID to add')
  .action((module_name) => addModuleCommand(module_name))

moduleCmd.command('list')
  .description('List all modules')
  .action(() => getModuleListCommand())

program.parse(process.argv);