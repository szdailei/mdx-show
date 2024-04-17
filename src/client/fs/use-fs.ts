import { useEffect, useState } from 'react';
import fsCommand from './fs-command';

export type AsyncData = string | string[];

export default function useFs(command: string, path: string | string[]) {
  const [aSyncFsData, setASyncFsData] = useState<AsyncData | RangeError>(null);

  useEffect(() => {
    let isUnMounted = false;

    async function getAsyncFsData() {
      if (isUnMounted || aSyncFsData) return;

      let result: AsyncData | RangeError;
      try {
        result = await fsCommand(command, path);
      } catch (error) {
        result = error instanceof Error ? new RangeError(error.message) : new RangeError(String(error));
      }
      if (isUnMounted) return;
      setASyncFsData(result);
    }

    void getAsyncFsData();

    return () => {
      isUnMounted = true;
    };
  }, [aSyncFsData, command, path]);

  const refetch = () => {
    setASyncFsData(null);
  };

  return { aSyncFsData, refetch };
}
