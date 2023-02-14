function preProcess(req, res, callback) {
  const allowOrigin = '*';
  const allowHeaders = '*';
  const allowMethods = 'GET,POST,OPTIONS';

  switch (req.method) {
    case 'OPTIONS':
      res.writeHead(200, {
        'Access-Control-Allow-Headers': allowHeaders,
        'Access-Control-Allow-Methods': allowMethods,
        'Access-Control-Allow-Origin': allowOrigin,
      });
      res.end();
      return;
    case 'GET':
    case 'POST':
      res.setHeader('Access-Control-Allow-Origin', allowOrigin);
      callback(req, res);
      return;
    default:
      res.writeHead(405, {
        'Access-Control-Allow-Headers': allowHeaders,
        'Access-Control-Allow-Methods': allowMethods,
      });
      res.end();
  }
}

export default preProcess;
