import React from 'react';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const Option = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled.option(style);
  return <Styled {...rest} ref={ref} />;
});

export default Option;
