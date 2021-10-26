import { useEffect, useState } from 'react';
import { setApiServerEndPoint, setDownloadServerUrl } from './network';
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
  setApiServerEndPoint();
  setDownloadServerUrl();

  return { data: true };
}

export { useRemoteConfig, useRemoteData };
