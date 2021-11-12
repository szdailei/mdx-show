import React from 'react';
import { makeid } from '../utils/index.js';
import useRemoteData from '../network/cache.js';
import { SLIDES_PATH } from '../route/route.js';
import { Flex } from '../styled/index.js';
import { Article, Header, Main, Section } from '../sectioning/index.js';
import { Error } from '../page-components/index.js';

function exitFullscreen() {
  if (document.fullscreenEnabled && document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function filterFileList(fileList) {
  const mdxFileList = [];
  if (!fileList) return mdxFileList;

  fileList.forEach((fileName) => {
    const fields = fileName.split('.');
    if (fields[fields.length - 1].toLowerCase() === 'md' || fields[fields.length - 1].toLowerCase() === 'mdx') {
      mdxFileList.push(fileName);
    }
  });

  return mdxFileList;
}

function Home() {
  const query = {
    command: 'getFileList',
    params: '/',
  };
  const { data, error } = useRemoteData(query);

  if (error) return <Error error={error} />;
  if (!data) return null;

  exitFullscreen();

  const children = [];
  const mdxFileList = filterFileList(data);

  mdxFileList.forEach((fileName) => {
    const href = `#${SLIDES_PATH}${fileName.toString()}`;
    const child = (
      <Flex key={makeid()} style={{ margin: '0.6em 0 0 2em' }}>
        <a href={href}>{fileName.toString()}</a>
      </Flex>
    );
    children.push(child);
  });

  const gridTemplateAreas = `
  'header'
  'main'
  `;
  return (
    <Article>
      <Section
        style={{
          margin: '48px 48px 24px',
          fontSize: '1.2em',
          letterSpacing: '2px',
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'auto auto',
          gridTemplateAreas,
        }}
      >
        <Header>MD/MDX File List</Header>
        <Main style={{ fontSize: '1.6em' }}>{children}</Main>
      </Section>
    </Article>
  );
}

export default Home;
