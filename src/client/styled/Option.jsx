import React from 'react';
import styled from './styled.js';

// eslint-disable-next-line react/prop-types
const Option = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled('option');
  return <Styled {...rest} style={style} ref={ref} />;
});

export default Option;
