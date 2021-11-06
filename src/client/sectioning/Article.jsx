import React from 'react';
import styled from '../styled/styled.js';

// eslint-disable-next-line react/prop-types
const Article = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled('article');
  return <Styled {...rest} style={style} ref={ref} />;
});

export default Article;
