import React from 'react';
import styled from './styled.js';

// eslint-disable-next-line react/prop-types
const Flex = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    display: 'flex',
    ...style,
  };
  const Styled = styled('div');
  return <Styled {...rest} style={objStyle} ref={ref} />;
});

export default Flex;
