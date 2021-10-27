/* eslint-disable no-console */
/* eslint-disable camelcase */
import fs from 'fs';
import { Octokit } from '@octokit/rest';
import { readPackageUp } from 'read-pkg-up';
import releaseInfo from './release-info.js';

function removeTheFirstLineOfReleaseNote(origRelaseNote) {
  let releaseNote = '';
  const lines = origRelaseNote.split('\n');
  for (let i = 1; i < lines.length; i += 1) {
    releaseNote += `${lines[i]}\n`;
  }
  return releaseNote;
}

(async () => {
  const { packageJson } = await readPackageUp();
  const { repository } = packageJson;

  const fields = repository.url.split('/');
  const owner = fields[fields.length - 2];
  const repoWithGit = fields[fields.length - 1];
  const repo = repoWithGit.slice(0, repoWithGit.length - 4);

  const { tag_name, name, releaseNotefileName } = await releaseInfo();
  const origReleaseNote = fs.readFileSync(releaseNotefileName, 'utf-8');
  const releaseNote = removeTheFirstLineOfReleaseNote(origReleaseNote);

  const token = process.env.GITHUB_TOKEN.trim();
  const octokit = new Octokit({ auth: token });

  try {
    await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name,
      name,
      body: releaseNote,
    });
    console.log(`Release ${name} sucessfully`);
  } catch (err) {
    console.log('err', err.toString());
  }
})();
