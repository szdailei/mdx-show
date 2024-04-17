/* eslint-disable no-console */
import { createServer } from '../http';
import dispatcher from '../dispatcher';

const serverStatus = [];

function exitProcess() {
  let active = false;
  serverStatus.forEach((status) => {
    active = active || status.active;
  });

  if (!active) process.exit(1);
}

async function stop(eventType, servers) {
  console.log(`\n${eventType} received, all servers are stoping ...`);

  servers.forEach((server, index) => {
    function onServerClosed() {
      console.log(`${serverStatus[index].name} stoped on port ${serverStatus[index].port}`);
      serverStatus[index].active = false;
      exitProcess();
    }

    server.unref();
    server.close(onServerClosed.bind({ index }));
    setImmediate(() => {
      server.emit('close');
    });
  });
}

function registerRunningServers(servers) {
  function onSignalTerm(eventType) {
    stop(eventType, servers);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onSignalTerm);
  });

  servers.forEach((server) => {
    const status = {
      name: server.name,
      message: server.message,
      port: server.address().port,
      active: true,
    };
    serverStatus.push(status);
    const message = status.message
      ? `\n${status.name} server started on port ${status.port}\n${status.message}`
      : `\n${status.name} server started on port ${status.port}`;
    console.log(message);
  });
}

function start(name, port, message) {
  const server = createServer(port, dispatcher);
  server.name = name;
  server.message = message;
  registerRunningServers([server]);
}

export { start, stop, registerRunningServers };
