import rpcHandler from '../handler';
import defaultEnv from '../../default-env';

const router = [
  {
    url: defaultEnv.rpcUrl,
    func: rpcHandler,
  },
];

export default router;
