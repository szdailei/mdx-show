/* eslint-disable no-console */
/* eslint-disable camelcase */
import { Octokit } from '@octokit/rest';
import { readPackageUp } from 'read-pkg-up';

(async () => {
  const { packageJson } = await readPackageUp();
  const { repository, version } = packageJson;

  const fields = repository.url.split('/');
  const owner = fields[fields.length - 2];
  const repoWithGit = fields[fields.length - 1];
  const repo = repoWithGit.slice(0, repoWithGit.length - 4);

  const date = new Date();
  const tag_name = `$v${version})`;
  const name = `${tag_name} (${date.toDateString()})`;

  const token = process.env.GITHUB_TOKEN.trim();
  const octokit = new Octokit({ auth: token });

  try {
    await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name,
      name,
    });
    console.log(`Release ${name} sucessfully`);
  } catch (err) {
    console.log('err', err.toString());
  }
})();
