import rpcRequest from './web/rpc-request';
import { getMatches, type, readDir, readTextFile } from './web/fs';

function init() {
  rpcRequest.init();
}

export { init, getMatches, type, readDir, readTextFile };
