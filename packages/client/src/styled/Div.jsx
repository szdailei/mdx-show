import React from 'react';
import styled from './styled';

// eslint-disable-next-line react/prop-types
const Div = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled('div');
  return <Styled {...rest} style={style} ref={ref} />;
});

export default Div;
