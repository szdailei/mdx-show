/* eslint-disable no-console */
import shell from 'shelljs';
import releaseInfo from './release-info.js';
import { updateGitIndex } from './update-repo.js';

const npmRegistry = 'https://registry.npmjs.org/';

function whichFilesRequiredUpdate(stdout) {
  const lines = stdout.split('\n');
  const files = [];
  lines.forEach((line) => {
    const fields = line.split(':');
    const file = fields[0].trim();
    if (file !== '') {
      files.push(fields[0]);
    }
  });
  return files;
}

async function toNpm() {
  const result = updateGitIndex();
  if (result.code !== 0) {
    const changedFiles = whichFilesRequiredUpdate(result.stdout);
    console.log('whichFilesRequiredUpdate', changedFiles);
    if (changedFiles.length === 1 && changedFiles[0] === 'package.json') {
      console.log(`Warn: ${changedFiles[0]} changed, ignore it and continue`);
    } else {
      console.log(`Error: There is uncommitted changes, please "git add . && git-cz" before publish`);
      process.exit(1);
    }
  }

  const { repo, version } = await releaseInfo();

  shell.env.npm_config_registry = npmRegistry;
  if (shell.exec(`npm publish`).code === 0) {
    console.log(`npm publish ${repo} ${version} successful`);
  } else {
    console.log(`Error: npm publish ${repo} ${version} failed`);
    process.exit(1);
  }
}

export default toNpm;
