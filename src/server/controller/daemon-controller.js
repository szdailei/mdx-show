const serverStatus = [];

function log(msg) {
  // eslint-disable-next-line no-console
  console.log(msg);
}

function exitProcess() {
  let active = false;
  serverStatus.forEach((status) => {
    active = active || status.active;
  });

  if (!active) process.exit(1);
}

async function stop(eventType, servers) {
  log(`\n${eventType} received, all servers are stoping ...`);

  servers.forEach((server, index) => {
    function onServerClosed() {
      log(`${serverStatus[index].name} stoped on port ${serverStatus[index].port}`);
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
      port: server.address().port,
      active: true,
    };
    serverStatus.push(status);
    log(`${status.name} started on port ${status.port}`);
  });
}

export { stop, registerRunningServers };
