import defaultEnvOfServer from '../../src/server/default-env.js';

const { sseUrl } = defaultEnvOfServer;
if (!sseUrl) throw new ReferenceError('Build failed: missing ssePath');

const liveReloadClient = `<script type="module">
      const eventSource = new EventSource('${sseUrl}');
      const reload = () => {eventSource.close();location.reload(true)};
      eventSource.onmessage = reload;
      eventSource.onerror = () => (eventSource.onopen = reload);
    </script>`;

export default liveReloadClient;
