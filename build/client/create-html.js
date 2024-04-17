import liveReloadClientCode from './live-reload-client.js';
import defaultEnvOfClient from '../../src/client/default-env.js';

function createHtml(jsFileName, cssFileNames, production) {
  const { rootElement } = defaultEnvOfClient;
  if (!rootElement) throw new ReferenceError('Build failed: missing rootElement');

  const htmlInjected = production ? '' : liveReloadClientCode;

  let cssLink = '';
  for (let i = 0, { length } = cssFileNames; i < length; i += 1) {
    if (i === 0) {
      cssLink += `<link rel="stylesheet" href="${cssFileNames[i]}">`;
    } else {
      cssLink += `\n    <link rel="stylesheet" href="${cssFileNames[i]}">`;
    }
  }

  const jsScript = `<script type="module" src="${jsFileName}"></script>`;

  const html = `<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <title>MDX Show</title>
    ${jsScript}
    ${cssLink}
  </head>

  <body>
  <div id="${rootElement}">Loading JavaScript</div>
    <noscript>
      <h1 style="position:fixed;top:40%;left:30%">
        Please enable JavaScript
      </h1>
    </noscript>
    ${htmlInjected}
  </body>
</html>
`;

  return html;
}

export default createHtml;
