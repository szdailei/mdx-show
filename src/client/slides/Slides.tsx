import { useParams } from 'react-router-dom';
import { Error, Loading, ErrorBoundary } from '../common';
import useFs from '../fs/use-fs';
import Parser from './Parser';

function Slides() {
  const { id } = useParams();
  if (!id) throw new RangeError('param "id" is required');

  const command = 'readTextFile';
  const path = id;
  const { buffer } = useFs(command, path);

  if (!buffer) return <Loading />;
  if (buffer instanceof RangeError) return <Error>{buffer.message}</Error>;

  const mdx = buffer as string;

  return (
    <ErrorBoundary>
      <Parser mdx={mdx} />
    </ErrorBoundary>
  );
}

export default Slides;
