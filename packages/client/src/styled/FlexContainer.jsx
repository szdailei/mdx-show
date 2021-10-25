import React from 'react';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const FlexContainer = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexFlow: 'column wrap',
    ...style,
  };
  const Styled = styled.div(objStyle);
  return <Styled {...rest} ref={ref} />;
});

export default FlexContainer;
