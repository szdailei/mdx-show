// eslint-disable-next-line import/no-extraneous-dependencies
import { buildServer, cleanServer, buildApp, cleanApp } from '@szdailei/core/scripts/index.js';

(async () => {
  cleanServer();
  cleanApp();

  await buildServer();
  await buildApp();
})();
