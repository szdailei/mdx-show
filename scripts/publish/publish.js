/* eslint-disable no-console */
/* eslint-disable camelcase */
import fs from 'fs';
import { Octokit } from '@octokit/rest';
import { readPackageUp } from 'read-pkg-up';
import releaseInfo from './release-info.js';

(async () => {
  const { packageJson } = await readPackageUp();
  const { repository } = packageJson;

  const fields = repository.url.split('/');
  const owner = fields[fields.length - 2];
  const repoWithGit = fields[fields.length - 1];
  const repo = repoWithGit.slice(0, repoWithGit.length - 4);

  const { tag_name, name, releaseNotefileName } = await releaseInfo();
  const releaseNote = fs.readFileSync(releaseNotefileName);
  console.log("releaseNote",releaseNote)
  return

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
