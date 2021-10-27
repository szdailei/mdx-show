/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { createWriteStream } from 'fs';
import changelog from 'conventional-changelog';
import releaseInfo from './release-info.js';

(async () => {
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
      console.log(`Generated release note at ${releaseNotefileName}\nYou MUST check it before release`);
    });
})();
