import React from 'react';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const Span = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled.span(style);
  return <Styled {...rest} ref={ref} />;
});

export default Span;
