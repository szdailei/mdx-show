/* eslint-disable no-console */
import shell from 'shelljs';

const mainBranch = 'main';
const devBranch = 'dev';

function updateGitIndex() {
  return shell.exec('git update-index --refresh');
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

function isMajorOrMinorRelease(version) {
  const fields = version.split('.');
  if (fields[2].trim() === '0') return true;
  return false;
}

function switchToGitBranch(branch) {
  if (shell.exec(`git switch ${branch}`).code !== 0) {
    console.log(`Error: Failure switch to ${branch} branch`);
    process.exit(1);
  }
}

function switchToMainBranch() {
  switchToGitBranch(mainBranch);
}

function switchToDevBranch() {
  switchToGitBranch(devBranch);
}

function mergeDevBranch() {
  if (shell.exec(`git merge ${devBranch}`).code !== 0) {
    console.log(`Error: Failure merge ${devBranch} branch`);
    process.exit(1);
  }
}

export {
  updateGitIndex,
  addTagToLocalRepo,
  pushToRemoteRepo,
  isMajorOrMinorRelease,
  switchToMainBranch,
  switchToDevBranch,
  mergeDevBranch,
};
