import React from 'react';
import styled from '../styled/styled';

// eslint-disable-next-line react/prop-types
const Main = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    gridArea: 'main',
    ...style,
  };
  const Styled = styled('main');
  return <Styled {...rest} style={objStyle} ref={ref} />;
});

export default Main;
