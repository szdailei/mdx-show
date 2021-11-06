import { useEffect, useState } from 'react';
import request from './client.js';

function useRemoteData(command) {
  const [cache, setCache] = useState();

  function refetch() {
    setCache(null);
  }

  useEffect(() => {
    let isMounted = true;

    async function getRemoteData() {
      const result = await request(command);
      if (isMounted) setCache(result);
    }

    if (!cache) getRemoteData();

    return () => {
      isMounted = false;
    };
  }, [cache, command]);

  const { data, error } = cache || { data: null, error: null };
  return { data, error, refetch };
}

export default useRemoteData;
