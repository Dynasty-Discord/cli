import chalk from 'chalk';
import fs from 'fs-extra';
export function verifyDynasty() {
  const path = process.cwd();

  fs.readFile(`${path}/package.json`, 'utf8', (err, data) => {
      try {
        if (err) {
          throw new Error('You must be in a DynastyCore project to use this command');
        }
        const packageJson = JSON.parse(data);
        if (packageJson.name !== 'dynastycore') {
          throw new Error('You must be in a DynastyCore project to use this command');
        }
      } catch (err) {
        console.error(chalk.red('This is not a DynastyCore project, please run this command in a DynastyCore root directory.'))
        process.exit(1);
      }
    });
}