import React from 'react';
import styled from './styled';

// eslint-disable-next-line react/prop-types
const P = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled('p');
  return <Styled {...rest} style={style} ref={ref} />;
});

export default P;
