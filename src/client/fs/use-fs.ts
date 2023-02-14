import { useEffect, useState } from 'react';
import fsCommand from './fs-command';

export type AsyncData = string | string[];

export default function useFs(command: string, path: string | string[]) {
  const [buffer, setBuffer] = useState<AsyncData | RangeError>(null);

  useEffect(() => {
    let isUnMounted = false;

    async function getAsyncData() {
      if (isUnMounted || buffer) return;

      let result;
      try {
        result = await fsCommand(command, path);
      } catch (error) {
        result = error instanceof Error ? new RangeError(error.message) : new RangeError(String(error));
      }
      if (isUnMounted) return;
      setBuffer(result as AsyncData);
    }

    void getAsyncData();

    return () => {
      isUnMounted = true;
    };
  }, [buffer, command, path]);

  const refetch = () => {
    setBuffer(null);
  };

  return { buffer, refetch };
}
