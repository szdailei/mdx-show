import { useParams } from 'react-router-dom';
import { Error, Loading, ErrorBoundary } from '../common';
import useFs from '../fs/use-fs';
import Parser from './Parser';

function Slides() {
  const { id } = useParams();
  if (!id) throw new RangeError('param "id" is required');

  const command = 'readTextFile';
  const path = id;
  const { aSyncFsData } = useFs(command, path);

  if (!aSyncFsData) return <Loading />;
  if (aSyncFsData instanceof RangeError) return <Error>{aSyncFsData.message}</Error>;

  const mdx = aSyncFsData as string;

  return (
    <ErrorBoundary>
      <Parser mdx={mdx} />
    </ErrorBoundary>
  );
}

export default Slides;
