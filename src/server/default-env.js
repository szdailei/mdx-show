const defaultEnv = {
  staticServer: {
    port: 3000,
    root: '../client/',
  },
  storage: {
    root: '.',
  },
  rpcUrl: '/rpc-server/',
  sseUrl: '/server-sent-events/',
  mediaUrl: '/media-server/',
  imagesDir: 'images/',
  videosDir: 'videos/',
};

export default defaultEnv;
