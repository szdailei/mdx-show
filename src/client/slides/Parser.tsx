import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import type { ReactElementWithhChildren } from './html-jsx-to-react/index.d';
import { Error, Loading } from '../common';
import mdxToHtmlJsx from './mdx-to-html-jsx';
import htmlJsxToReact from './html-jsx-to-react';
import useImport from './use-import';
import createPages from './create-pages';
import Article from './Article';

export default function Parser({ mdx }: { mdx: string }) {
  const inspectorRef = useRef();

  const { importedFiles, jsxCode, html, title } = mdxToHtmlJsx(mdx);
  const importedJsxAndCss = useImport(importedFiles);

  if (typeof importedJsxAndCss === 'string') return <Loading />;
  if (importedJsxAndCss instanceof RangeError) return <Error>{importedJsxAndCss.message}</Error>;

  let elements: ReactElementWithhChildren[];

  let css;
  if (jsxCode.length === 0 && !importedJsxAndCss) {
    elements = htmlJsxToReact(html, { inspectorRef });
  } else {
    let allJsxCode: string;
    if (importedJsxAndCss) {
      allJsxCode = `${importedJsxAndCss.jsx}\n${jsxCode}`;
      css = importedJsxAndCss.css;
    } else {
      allJsxCode = jsxCode;
    }
    elements = htmlJsxToReact(html, { jsxCode: allJsxCode, inspectorRef });
  }

  const pages = createPages(elements);

  if (!title && !css) return <Article pages={pages} />;

  let helmet;
  if (title && css) {
    helmet = (
      <Helmet>
        <title>{title}</title>
        <style>{css}</style>
      </Helmet>
    );
  } else if (title) {
    helmet = (
      <Helmet>
        <title>{title}</title>
      </Helmet>
    );
  } else {
    helmet = (
      <Helmet>
        <style>{css}</style>
      </Helmet>
    );
  }

  return (
    <>
      {helmet}
      <Article pages={pages} />
    </>
  );
}
