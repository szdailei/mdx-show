import { readPackageUp } from 'read-pkg-up';
import request from './client.js';

(async () => {
  const { packageJson } = await readPackageUp();
  const { repository, version } = packageJson;

  const fields = repository.url.split('/');
  let owner = fields[fields.length - 2];
  const repoWithGit = fields[fields.length - 1];
  let repo = repoWithGit.slice(0, repoWithGit.length - 4);

  const date = new Date()
  const releaseName = `${version} (${date.toDateString()})`

  owner = 'facebook'
  repo = 'react'
  const query = `query {
    repository(owner:"${owner}", name:"${repo}") {
      release(tagName: "v17.0.2") {
        name
        tagName
        description
      
      }
  }}`;

  const mutation = `mutation {
    repository(owner:"${owner}", name:"${repo}") {
      createRelease() {
        name:"${releaseName}"
        tagName: "v${version}"
        description:"### Features\n\nRelease to github"
      }
  }}`;

  console.log("mutation",mutation)


  const token = (process.env['GITHUB_TOKEN'] || '').trim();
  const { data, error } = await request(mutation, { token });
  console.log({ data, error });
  console.log(data.repository);
})();
