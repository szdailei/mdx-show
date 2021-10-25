import React from 'react';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const P = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled.p(style);
  return <Styled {...rest} ref={ref} />;
});

export default P;
