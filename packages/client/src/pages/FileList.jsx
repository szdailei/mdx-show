import React from 'react';
import makeid from '../lib/makeid';
import { useRemoteData } from '../lib/cache';
import { SLIDES_PATH } from '../lib/route';
import { FlexContainer } from '../styled/index';
import { Article, Header, Main, Section } from '../sectioning/index';
import { Error } from '../components/index';

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

function FileList() {
  const query = '{getFileList(dir:"/")}';
  const { data, error } = useRemoteData(query);
  if (error) return <Error error={error} />;
  if (!data) return null;

  const children = [];
  const mdxFileList = filterFileList(data.getFileList);

  mdxFileList.forEach((fileName) => {
    const href = `#${SLIDES_PATH}${fileName.toString()}`;
    const child = (
      <FlexContainer key={makeid()} style={{ margin: '0.3em 0 0 2em', fontSize: '1.5em', letterSpacing: '2px' }}>
        <a href={href}>{fileName.toString()}</a>
      </FlexContainer>
    );
    children.push(child);
  });

  const gridTemplateAreas = `
  'header'
  'main'
  `;
  return (
    <Article>
      <Section style={{ gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto', gridTemplateAreas }}>
        <Header>MD/MDX File List</Header>
        <Main style={{ marginTop: '1em' }}>{children}</Main>
      </Section>
    </Article>
  );
}

export default FileList;
