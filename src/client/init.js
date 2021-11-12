import request from './network/client.js';
import debug from './debug/debug.js';

function toServer({ data }) {
  const query = {
    command: 'logger',
    params: data,
  };
  request(query);
}

const init = ({ aboveUrlOfFilterStack, aboveFuncNameOfFilterStack }) => {
  request.init();
  debug.init({ aboveUrlOfFilterStack, aboveFuncNameOfFilterStack, writeToFunc: toServer });
};

init.isFinished = () => request.isFinished();

export default init;
