import React from 'react';
import styled from './styled.js';

// eslint-disable-next-line react/prop-types
const Grid = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    display: 'grid',
    alignItems: 'center',
    ...style,
  };
  const Styled = styled('div');

  return <Styled {...rest} style={objStyle} ref={ref} />;
});

export default Grid;
