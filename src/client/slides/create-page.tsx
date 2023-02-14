import makeid from '../utils/makeid';
import type { ReactElementWithhChildren } from './html-jsx-to-react/index.d';

function createPage(pageElements: ReactElementWithhChildren[], currentPageNum: number, totalPageNum: number) {
  const page = [];
  let header;

  const { length: pageElementsLength } = pageElements;
  let footContent;
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
      if (typeof element.type === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (element.props?.children?.type?.name === 'Clock') {
          footContent = element;
        } else {
          maimElements.push(element);
        }
      } else if (element.type.name === 'Clock') {
        footContent = element;
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

  const footer = (
    <footer key={makeid()} className="grid grid-cols-right text-px-small">
      <div className="text-center">{footContent}</div>
      <div>
        page {currentPageNum + 1}/{totalPageNum}
      </div>
    </footer>
  );
  page.push(footer);

  const rows = header ? 'grid-rows-b-3' : 'grid-rows-b-2';
  return <section className={`min-h-screen mx-2 tracking-3 grid ${rows}`}>{page}</section>;
}

export default createPage;
