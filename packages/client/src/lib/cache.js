import { useEffect, useState } from 'react';
import { setApiServerEndPoint, setDownloadServerUrl } from './network';
import request from './client';

function useRemoteData(query) {
  const [cache, setCache] = useState();

  function refetch() {
    setCache(null);
  }

  useEffect(() => {
    let isMounted = true;

    async function getRemoteData() {
      const result = await request(query);
      if (isMounted) setCache(result);
    }

    if (!cache) getRemoteData();

    return () => {
      isMounted = false;
    };
  }, [cache, query]);

  const { data, error } = cache || { data: null, error: null };
  return { data, error, refetch };
}

function useRemoteConfig() {
  setApiServerEndPoint();
  setDownloadServerUrl();

  return { data: true };
}

export { useRemoteConfig, useRemoteData };
