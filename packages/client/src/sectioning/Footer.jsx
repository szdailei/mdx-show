import React from 'react';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const Footer = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    gridArea: 'footer',
    fontSize: '0.7em',
    ...style,
  };
  const Styled = styled.footer(objStyle);
  return <Styled {...rest} ref={ref} />;
});

export default Footer;
