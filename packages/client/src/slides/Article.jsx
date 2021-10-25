import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Article as RealArticle } from '../sectioning';

const Article = React.forwardRef(({ pages, ...rest }, ref) => {
  const [currentPageCount, setCurrentPageCount] = useState(0);

  useImperativeHandle(ref, () => ({
    getCurrentPageCount: () => currentPageCount,
    setCurrentPageCount: (count) => {
      setCurrentPageCount(count);
    },
  }));

  const showData = pages[currentPageCount];
  return (
    <RealArticle style={{ fontSize: '1.8em', lineHeight: '1.8' }} {...rest} ref={ref}>
      {showData}
    </RealArticle>
  );
});

Article.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default Article;
