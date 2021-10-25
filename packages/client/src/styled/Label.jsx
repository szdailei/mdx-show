import React from 'react';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const Label = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled.label(style);
  return <Styled {...rest} ref={ref} />;
});

export default Label;
