/* eslint-disable no-console */
/* eslint-disable camelcase */
import fs from 'fs';
import { Octokit } from '@octokit/rest';
import releaseInfo from './release-info.js';
import {
  updateGitIndex,
  addTagToLocalRepo,
  pushToRemoteRepo,
  isMajorOrMinorRelease,
  switchToMainBranch,
  switchToDevBranch,
  mergeDevBranch,
} from './update-repo.js';

function removeTheFirstLineOfReleaseNote(origRelaseNote) {
  let releaseNote = '';
  const lines = origRelaseNote.split('\n');
  for (let i = 1; i < lines.length; i += 1) {
    releaseNote += `${lines[i]}\n`;
  }
  return releaseNote;
}

async function toGitHub() {
  const { repo, owner, version, tag_name, name, releaseNotefileName } = await releaseInfo();

  try {
    fs.statSync(releaseNotefileName);
  } catch (error) {
    console.log(`Error: ${releaseNotefileName} not found. You MUST generate and check it before publish`);
    process.exit(1);
  }

  const origReleaseNote = fs.readFileSync(releaseNotefileName, 'utf-8');
  const releaseNote = removeTheFirstLineOfReleaseNote(origReleaseNote);

  let octokit;
  try {
    const token = process.env.GITHUB_TOKEN.trim();
    octokit = new Octokit({ auth: token });
  } catch (error) {
    console.log(`Error: GITHUB_TOKEN not set or wrong. You MUST export GITHUB_TOKEN to environment`);
    process.exit(1);
  }

  if (updateGitIndex().code !== 0) {
    console.log('Error: There is uncommitted changes, please "git add . && git-cz" before publish');
    process.exit(1);
  }

  if (isMajorOrMinorRelease(version)) {
    switchToMainBranch();
    mergeDevBranch();
    pushToRemoteRepo();
    switchToDevBranch();
  }

  addTagToLocalRepo(version);
  pushToRemoteRepo();

  try {
    await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name,
      name,
      body: releaseNote,
    });
    console.log(`${name} published to github`);
  } catch (err) {
    console.log('err', err.toString());
  }
}

export default toGitHub;
