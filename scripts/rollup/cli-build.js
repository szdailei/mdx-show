import buildServer from './build-server.js';
import buildApp from './build-app.js';

(async () => {
  await buildServer();

  await buildApp();
})();
