import React from 'react';
import styled from './styled.js';

// eslint-disable-next-line react/prop-types
const List = React.forwardRef(({ ordered = false, depth = 1, children, style, ...rest }, ref) => {
  let objStyle;

  switch (depth) {
    case 2:
      objStyle = {
        fontSize: '0.93em',
        ...style,
      };
      break;
    case 3:
      objStyle = {
        fontSize: '0.93em',
        ...style,
      };
      break;
    case 1:
    case 4:
    default:
      objStyle = {
        ...style,
      };
      break;
  }

  const Styled = ordered ? styled('ol') : styled('ul');
  return (
    <Styled {...rest} style={objStyle} ref={ref}>
      {children}
    </Styled>
  );
});

export default List;
