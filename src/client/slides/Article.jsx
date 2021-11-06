import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Article as RealArticle } from '../sectioning/index.js';

const Article = React.forwardRef(({ pages, style, ...rest }, ref) => {
  const [currentPageCount, setCurrentPageCount] = useState(0);

  useImperativeHandle(ref, () => ({
    getCurrentPageCount: () => currentPageCount,
    setCurrentPageCount: (count) => {
      setCurrentPageCount(count);
    },
  }));

  const showData = pages[currentPageCount];
  return (
    <RealArticle {...rest} style={style} ref={ref}>
      {showData}
    </RealArticle>
  );
});

Article.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.element).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

Article.defaultProps = {
  style: null,
};

export default Article;
