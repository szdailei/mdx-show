import Clock from '../built-in/built-ins/Clock';
import makeid from '../utils/makeid';
import type { ReactElementWithhChildren } from './html-jsx-to-react/index.d';

function createPage(pageElements: ReactElementWithhChildren[], currentPageNum: number, totalPageNum: number) {
  const page = [];
  let header;

  const { length: pageElementsLength } = pageElements;
  const footLeft = <Clock />;
  let footCenter: string;
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
        if (element.type === 'footer') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          footCenter = element.props.children.props.children as string;
        } else {
          maimElements.push(element);
        }
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
      <div id="footer_left">{footLeft}</div>
      <div id="footer_center" className="text-center">
        {footCenter}
      </div>
      <div id="footer_right" className="text-right">
        {footRight}
      </div>
    </footer>
  );
  page.push(footer);

  const rows = header ? 'grid-rows-b-3' : 'grid-rows-b-2';
  return <section className={`min-h-screen mx-2 tracking-3 grid ${rows}`}>{page}</section>;
}

export default createPage;
