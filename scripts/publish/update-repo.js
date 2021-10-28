/* eslint-disable no-console */
import shell from 'shelljs';

function isLocalRepoUpdated() {
  if (shell.exec('git update-index --refresh').code === 0) {
    return true;
  }
  return false;
}

function addTagToLocalRepo(version) {
  if (shell.exec(`git tag ${version}`).code !== 0) {
    console.log(`Error: Git tag ${version} failed`);
    process.exit(1);
  }
}

function pushToRemoteRepo() {
  if (shell.exec('git push').code !== 0) {
    console.log('Error: Git push failed');
    process.exit(1);
  }
}

export { isLocalRepoUpdated, addTagToLocalRepo, pushToRemoteRepo };
