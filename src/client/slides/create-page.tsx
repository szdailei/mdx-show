import Clock from '../built-in/built-ins/Clock';
import makeid from '../utils/makeid';
import type { ReactElementWithhChildren } from './html-jsx-to-react/index.d';
import inspect from '../inspect';

function createPage(
  pageElements: ReactElementWithhChildren[],
  options: { currentPageNum: number; totalPageNum: number; showFooterClock: boolean }
) {
  const page = [];
  let header;

  const { length } = pageElements;
  const { currentPageNum, totalPageNum, showFooterClock } = options;
  let footCenter: string;
  if (length > 0) {
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

    const mainElements: ReactElementWithhChildren[] = [];

    for (let i = header ? 1 : 0; i < length; i += 1) {
      const element = pageElements[i];
      if (typeof element.type === 'string') {
        if (element.type === 'footer') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          footCenter = element.props.children.props.children as string;
        } else {
          mainElements.push(element);
        }
      } else {
        mainElements.push(element);
      }
    }

    const main = (
      <main key={makeid()} className="leading-px-normal text-px-normal">
        {mainElements}
      </main>
    );
    page.push(main);
  }

  const footRight = `page ${currentPageNum + 1}/${totalPageNum}`;
  const visible = showFooterClock ? 'visible' : 'hidden';
  const footer = (
    <footer key={makeid()} className="grid grid-cols-3 text-px-small">
      <div style={{ visibility: visible }}>
        <Clock />
      </div>
      <div className="text-center">{footCenter}</div>
      <div className="text-right">{footRight}</div>
    </footer>
  );
  page.push(footer);

  inspect({ currentPageNum, page });

  const rows = header ? 'grid-rows-b-3' : 'grid-rows-b-2';
  return <section className={`min-h-screen mx-2 tracking-3 grid ${rows}`}>{page}</section>;
}

export default createPage;
