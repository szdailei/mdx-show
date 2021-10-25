import React from 'react';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const Button = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    cursor: 'pointer',
    width: 'fit-content',
    margin: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#f86e67',
    ...style,
  };

  const Styled = styled.div(objStyle);
  return <Styled {...rest} ref={ref} />;
});

export default Button;
