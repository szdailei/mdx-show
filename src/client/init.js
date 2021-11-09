import request from './network/client.js';
import debug from './debug/debug.js';

function toServer({data}) {
  const query = {
    command: 'logger',
    params: data,
  };
  request(query);
}

const init = ({ entryFunc }) => {
  request.init();
  debug.init({ entryFunc, writeToFunc: toServer });
};

init.finished = () => request.finished();

export default init;
