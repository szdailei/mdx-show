/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import { createWriteStream } from 'fs';
import changelog from 'conventional-changelog-core';
import releaseInfo from './release-info.js';

async function genReleaseNote() {
  const { tag_name, releaseNotefileName } = await releaseInfo();

  const fileStream = createWriteStream(releaseNotefileName);

  changelog({
    preset: 'angular',
    pkg: {
      transform(pkg) {
        pkg.version = tag_name;
        return pkg;
      },
    },
  })
    .pipe(fileStream)
    .on('close', () => {
      console.log(`Generated release note at ${releaseNotefileName}\nYou MUST check it before publish`);
    });
}

export default genReleaseNote;
