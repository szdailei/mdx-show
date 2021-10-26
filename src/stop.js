import log from './log.js';

const state = {
  isSServerClosed: false,
  isGServerClosed: false,
  isDServerClosed: false,
  sServerPort: 0,
  gServerPort: 0,
  DServerPort: 0,
};

function exitProcess(code) {
  if (state.isSServerClosed && state.isGServerClosed && state.isDServerClosed) process.exit(code);
}

function onSServerClosed() {
  log.warn(`web-server on port ${state.sServerPort} stoped`);
  state.isSServerClosed = true;
  exitProcess(1);
}

function onGServerClosed() {
  log.warn(`api-server on port ${state.gServerPort} stoped`);
  state.isGServerClosed = true;
  exitProcess(1);
}

function onDServerClosed() {
  log.warn(`download-server on port ${state.dServerPort} stoped`);
  state.isDServerClosed = true;
  exitProcess(1);
}

async function stop(eventType, sServer, gServer, dServer) {
  log.warn(`\n${eventType} received, all servers are stoping ...`);

  state.sServerPort = sServer.address().port;
  state.gServerPort = gServer.address().port;
  state.dServerPort = dServer.address().port;

  sServer.close(onSServerClosed);
  gServer.close(onGServerClosed);
  dServer.close(onDServerClosed);

  setImmediate(() => {
    sServer.emit('close');
    gServer.emit('close');
    dServer.emit('close');
  });

  exitProcess(1);
}

export default stop;
