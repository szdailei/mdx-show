import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import toNpm from '@szdailei/dev-scripts/scripts/publish/to-npm.js';

async function toNpmWithoutUselessDependencies() {
  const pkgFile = './package.json';
  const date = Date.now();
  const tempFile = `package.temp.${date}.json`;

  const pkgString = fs.readFileSync(pkgFile, 'utf-8');

  const pkgJson = JSON.parse(pkgString);
  delete pkgJson.scripts;
  delete pkgJson.devDependencies;

  const newDependencies = {
    minimist: pkgJson.dependencies.minimist,
  };
  pkgJson.dependencies = newDependencies;
  const withoutDependencies = JSON.stringify(pkgJson, undefined, 2);

  fs.writeFileSync(tempFile, pkgString, 'utf-8');
  fs.writeFileSync(pkgFile, withoutDependencies, 'utf-8');

  await toNpm();

  fs.writeFileSync(pkgFile, pkgString, 'utf-8');
  fs.unlinkSync(tempFile);
}

export default toNpmWithoutUselessDependencies;
