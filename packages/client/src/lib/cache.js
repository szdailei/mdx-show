import { useEffect, useState } from 'react';
import TOML from 'toml';
import { setApiServerEndPoint, getServerConfigUrl, setDownloadServerUrl } from './network';
import request from './network-client';

function useRemoteData(query, resType, endPoint, method) {
  const [cache, setCache] = useState();

  function refetch() {
    setCache(null);
  }

  useEffect(() => {
    let isMounted = true;

    async function getRemoteData() {
      const result = await request(query, resType, endPoint, method);
      if (isMounted) setCache(result);
    }

    if (!cache) getRemoteData();

    return () => {
      isMounted = false;
    };
  }, [cache, query, resType, endPoint, method]);

  const { data, error } = cache || { data: null, error: null };
  return { data, error, refetch };
}

function useRemoteConfig() {
  // eslint-disable-next-line prefer-const
  let { data, error } = useRemoteData(null, 'text', getServerConfigUrl(), 'GET');

  if (data || error) {
    const config = data ? TOML.parse(data) : {};
    data = data || error;
    setApiServerEndPoint(config);
    setDownloadServerUrl(config);
  }

  return { data };
}

export { useRemoteConfig, useRemoteData };
