import React from 'react';
import styled from './styled';

// eslint-disable-next-line react/prop-types
const Abbr = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    textDecoration: 'none',
    ...style,
  };

  const Styled = styled('abbr');
  return <Styled {...rest} style={objStyle} ref={ref} />;
});

export default Abbr;
