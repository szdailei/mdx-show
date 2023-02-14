/* eslint-disable no-await-in-loop */
import net from 'net';

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => {
      resolve(false);
    });

    server.listen({ port }, () => {
      server.close();
      resolve(true);
    });
  });
}

async function findTheFirstAvailablePort(startPort, { amount } = {}) {
  let staticServerPort = startPort;

  const range = amount || 1;

  while (staticServerPort < 65535) {
    for (let i = 0; i < range; i += 1) {
      if (await isPortAvailable(staticServerPort)) {
        return staticServerPort;
      }
      staticServerPort += 1;
    }
  }

  return null;
}

export { isPortAvailable, findTheFirstAvailablePort };
