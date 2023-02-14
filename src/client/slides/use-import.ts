import { useEffect, useState } from 'react';
import fsCommand from '../fs/fs-command';

type ImportedJsxAndCss =
  | {
      jsx: string;
      css: string;
    }
  | string
  | RangeError;

function isCssFile(file: string) {
  const fields = file.split('.');
  const ext = fields[fields.length - 1];
  return ext === 'css';
}

function useImport(files: string[]) {
  const [importedJsxAndCss, setImportedJsxAndCss] = useState<ImportedJsxAndCss>(''); // empty string means loading

  useEffect(() => {
    let isUnMounted = false;

    async function getAsyncData() {
      if (isUnMounted || importedJsxAndCss) return;

      const command = 'readTextFile';
      let result: ImportedJsxAndCss = {
        jsx: '',
        css: '',
      };
      try {
        const { length } = files;
        if (length === 0) {
          setImportedJsxAndCss(null);
          return;
        }

        for (let i = 0; i < length; i += 1) {
          const file = files[i];
          // eslint-disable-next-line no-await-in-loop
          const content = (await fsCommand(command, file)) as string;
          if (isCssFile(file)) {
            result.css += `${content}\n`;
          } else {
            result.jsx += `${content}\n`;
          }
        }
      } catch (error) {
        result = error instanceof Error ? new RangeError(error.message) : new RangeError(String(error));
      }

      if (isUnMounted) return;

      if (result instanceof RangeError) {
        setImportedJsxAndCss(result);
      } else if (result.jsx.length === 0) {
        setImportedJsxAndCss(null);
      } else {
        setImportedJsxAndCss(result);
      }
    }

    void getAsyncData();

    return () => {
      isUnMounted = true;
    };
  }, [files, importedJsxAndCss]);

  return importedJsxAndCss;
}

export default useImport;
