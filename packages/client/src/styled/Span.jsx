import React from 'react';
import styled from './styled';

// eslint-disable-next-line react/prop-types
const Span = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled('span');
  return <Styled {...rest} style={style} ref={ref} />;
});

export default Span;
