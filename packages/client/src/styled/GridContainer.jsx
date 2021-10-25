import React from 'react';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const GridContainer = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    display: 'grid',
    alignItems: 'center',
    ...style,
  };
  const Styled = styled.div(objStyle);

  return <Styled {...rest} ref={ref} />;
});

export default GridContainer;
