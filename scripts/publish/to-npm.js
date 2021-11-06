/* eslint-disable no-console */
import fs from 'fs';
import shell from 'shelljs';
import releaseInfo from './release-info.js';
import { isLocalRepoUpdated } from './update-repo.js';

(async () => {
  if (!isLocalRepoUpdated()) {
    console.log('Error: There is uncommitted changes, please "git add . && git-cz" before publish');
    process.exit(1);
  }

  const { repo, version, files } = await releaseInfo();

  files.forEach((file) => {
    try {
      fs.statSync(file);
    } catch (error) {
      console.log(`Error: ${file} not found. You MUST build it`);
      process.exit(1);
    }
  });

  if (shell.exec(`npm publish`).code === 0) {
    console.log(`npm publish ${repo} ${version} successful`);
  } else {
    console.log(`Error: npm publish ${repo} ${version} failed`);
    process.exit(1);
  }
})();
