import makeid from '../utils/makeid';
import { SLIDES_RAW_PATH } from '../routes';
import useFs from '../fs/use-fs';
import { Error, Loading } from '../common';
import lazyWithPreload from '../lazy-with-preload';

function filterPaths(paths: string[]) {
  const mdxPaths: string[] = [];

  paths.forEach((path) => {
    const fields = path.split('.');
    if (fields[fields.length - 1].toLowerCase() === 'md' || fields[fields.length - 1].toLowerCase() === 'mdx') {
      mdxPaths.push(path);
    }
  });

  return mdxPaths;
}

function getFileByPath(path: string) {
  const fields = path.split('/');
  return fields[fields.length - 1];
}

function Home() {
  const command = 'readDir';
  const rootDir = '/';

  const { aSyncFsData } = useFs(command, rootDir);

  if (!aSyncFsData) return <Loading />;
  if (aSyncFsData instanceof RangeError) return <Error>{aSyncFsData.message}</Error>;

  const children: JSX.Element[] = [];
  const mdxPaths = filterPaths(aSyncFsData as string[]);

  mdxPaths.forEach((mdxPath) => {
    const mdxFile = getFileByPath(mdxPath);

    const href = `#${SLIDES_RAW_PATH}${mdxFile}`;
    const child = (
      <a href={href} key={makeid()} className="text-2xl cursor-pointer bg-white odd:bg-gray-300 hover:bg-sky-300">
        {mdxFile}
      </a>
    );
    children.push(child);
  });

  const Slides = lazyWithPreload(() => import('../slides/Slides'));
  void Slides.preload();

  return (
    <article className="mx-48 mt-4">
      <div className="mb-12 text-3xl font-bold">MD/MDX files</div>
      <div className="mx-12 grid gap-4">{children}</div>
    </article>
  );
}

export default Home;
