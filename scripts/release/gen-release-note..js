/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { createWriteStream } from 'fs';
import changelog from 'conventional-changelog';
import { readPackageUp } from 'read-pkg-up';

(async () => {
  const { packageJson } = await readPackageUp();

  const { version } = packageJson;
  const file = `./RELEASE_NOTE${version ? `_${version}` : ``}.md`;
  const fileStream = createWriteStream(file);

  changelog({
    preset: 'angular',
    pkg: {
      transform(pkg) {
        pkg.version = `v${version}`;
        return pkg;
      },
    },
  })
    .pipe(fileStream)
    .on('close', () => {
      console.log(`Generated release note at ${file}`);
    });
})();
