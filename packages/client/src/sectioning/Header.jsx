import React from 'react';
import styled from '../styled/styled';

// eslint-disable-next-line react/prop-types
const Header = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    gridArea: 'header',
    marginBottom: '0.4em',
    fontSize: '1.4em',
    fontWeight: '700',
    ...style,
  };
  const Styled = styled('header');
  return <Styled {...rest} style={objStyle} ref={ref} />;
});

export default Header;
