import log from './log';

let isSServerClosed = false;
let isGServerClosed = false;
let isDServerClosed = false;

function exitProcess(code) {
  if (isSServerClosed && isGServerClosed && isDServerClosed) process.exit(code);
}

function onSServerClosed() {
  log.warn('static-server stoped');
  isSServerClosed = true;
  exitProcess(1);
}

function onGServerClosed() {
  log.warn('api-server stoped');
  isGServerClosed = true;
  exitProcess(1);
}

function onDServerClosed() {
  log.warn('download-server stoped');
  isDServerClosed = true;
  exitProcess(1);
}

async function stop(eventType, sServer, gServer, dServer) {
  log.warn('%s received, api-server and static-server stoping ...', eventType);

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
