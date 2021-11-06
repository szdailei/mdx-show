import React from 'react';
import styled from './styled.js';

// eslint-disable-next-line react/prop-types
const Label = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled('label');
  return <Styled {...rest} style={style} ref={ref} />;
});

export default Label;
