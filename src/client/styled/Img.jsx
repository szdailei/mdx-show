/* eslint-disable react/prop-types */
import React from 'react';
import styled from './styled.js';

const Img = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    display: 'block',
    margin: 'auto',
    ...style,
  };

  const Styled = styled('img');
  return <Styled {...rest} style={objStyle} ref={ref} />;
});

export default Img;
