import makeid from '../utils/makeid';
import type { ReactElementWithhChildren } from './html-jsx-to-react/index.d';

function createPage(pageElements: ReactElementWithhChildren[], currentPageNum: number, totalPageNum: number) {
  const page = [];
  let header;

  const { length: pageElementsLength } = pageElements;
  let footLeft;
  let footCenter;
  if (pageElementsLength > 0) {
    const [first] = pageElements;
    if (first.type === 'header') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const headerStr = first.props.children as string;
      header = (
        <header key={makeid()} className="text-px-bigger font-semibold">
          {headerStr}
        </header>
      );
      page.push(header);
    }

    const maimElements = [];
    for (let i = header ? 1 : 0; i < pageElementsLength; i += 1) {
      const element = pageElements[i];
      console.log(element);
      if (typeof element.type === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (element.props?.children?.type?.name === 'Clock') {
          footLeft = element;
        } else if (element.type === 'footer' && element.props?.children?.props?.children) {
          footCenter = element.props.children.props.children;
        } else {
          maimElements.push(element);
        }
      } else if (element.type.name === 'Clock') {
        footLeft = element;
      } else {
        maimElements.push(element);
      }
    }

    const main = (
      <main key={makeid()} className="leading-px-normal text-px-normal">
        {maimElements}
      </main>
    );
    page.push(main);
  }

  const footRight = `page ${currentPageNum + 1}/${totalPageNum}`;
  const footer = (
    <footer key={makeid()} className="grid grid-cols-3 text-px-small">
      <div>{footLeft}</div>
      <div className="text-center">{footCenter}</div>
      <div className="text-right">{footRight}</div>
    </footer>
  );
  page.push(footer);

  const rows = header ? 'grid-rows-b-3' : 'grid-rows-b-2';
  return <section className={`min-h-screen mx-2 tracking-3 grid ${rows}`}>{page}</section>;
}

export default createPage;
