import { join } from 'path';
import defaultEnv from './default-env';
import staticServer from './static-server';
import { isRpcReq, rpcServer } from './rpc-server';
import { isServerSentEventsReq, sseServer } from './server-sent-events';

function isMediaReq(url) {
  return url.indexOf(defaultEnv.mediaUrl) === 0;
}

function getMediaFile(path) {
  const mediaFile = path.slice(defaultEnv.mediaUrl.length);
  return mediaFile;
}

async function dispatcher(req, res) {
  const url = decodeURI(req.url);

  if (isRpcReq(url)) {
    rpcServer(req, res);
    return;
  }

  //! [PositionForDevCodeBegin]
  // eslint-disable-next-line no-undef
  if (!NODE_ENV_PRODUCTION) {
    if (isServerSentEventsReq(url)) {
      sseServer(req, res);
      return;
    }
  }
  //! [PositionForDevCodeEnd]

  let path;

  if (isMediaReq(url)) {
    const mediaFile = getMediaFile(url);
    path = join(defaultEnv.storage.root, mediaFile);
  } else {
    path = join(defaultEnv.staticServer.root, url);
  }

  const options = {
    url,
    path,
  };

  staticServer(req, res, options);
}

export default dispatcher;
