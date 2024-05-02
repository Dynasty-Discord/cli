import fs from 'fs-extra';
export function verifyDynasty() {
  const path = process.cwd();

  fs.readFile(`${path}/package.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const packageJson = JSON.parse(data);
    if (packageJson.name !== 'dynastycore') {
      console.error('This is not a DynastyCore project, please run this command in a DynastyCore root directory.');
      process.exit(1);
    }
  });
}