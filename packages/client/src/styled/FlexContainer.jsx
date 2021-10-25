import React from 'react';
import styled from './styled';

// eslint-disable-next-line react/prop-types
const FlexContainer = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexFlow: 'column wrap',
    ...style,
  };
  const Styled = styled('div');
  return <Styled {...rest} style={objStyle} ref={ref} />;
});

export default FlexContainer;
