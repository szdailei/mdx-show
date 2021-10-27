/* eslint-disable camelcase */
import { readPackageUp } from 'read-pkg-up';

async function releaseInfo() {
  const { packageJson } = await readPackageUp();
  const { version } = packageJson;
  const tag_name = `v${version}`;
  const date = new Date();
  const name = `${tag_name} (${date.toDateString()})`;
  const releaseNotefileName = `./RELEASE_NOTE${`_${version}`}.md`;

  return { releaseNotefileName, version, tag_name, name };
}

export default releaseInfo;
