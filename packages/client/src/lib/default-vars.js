const defaultVars = {
  port: 3000,
  imagesDir: 'images/',
  videosDir: 'videos/',
};

function getDefaultStaticServerEndPoint() {
  const endPoint = `http://localhost:${defaultVars.port}`;
  return endPoint;
}

function getApiServerPort(staticServerPort) {
  const port = typeof staticServerPort === 'string' ? parseInt(staticServerPort, 10) : staticServerPort;
  return port + 1;
}

function getDownloadServerPort(staticServerPort) {
  const port = typeof staticServerPort === 'string' ? parseInt(staticServerPort, 10) : staticServerPort;
  return port + 2;
}

export { defaultVars, getApiServerPort, getDownloadServerPort, getDefaultStaticServerEndPoint };
