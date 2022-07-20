import { request } from './network/index.js';
import debug from './debug/debug.js';
import { realSrc } from './markdown/index.js';

function toServer({ data }) {
  const query = {
    command: 'logger',
    params: data,
  };
  request(query);
}

const init = ({ aboveUrlOfFilterStack, aboveFuncNameOfFilterStack }) => {
  request.init();
  realSrc.init();
  debug.init({
    aboveUrlOfFilterStack,
    aboveFuncNameOfFilterStack,
//    writeToFunc: toServer, // comment this line to avoid write log file
  });
};

init.isFinished = () => request.isFinished();

export default init;
