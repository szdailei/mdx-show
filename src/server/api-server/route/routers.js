import rpcHandler from '../handler/rpc-handler.js';

const routers = [
  {
    path: '/rpc',
    func: rpcHandler,
  },
];

export default routers;
