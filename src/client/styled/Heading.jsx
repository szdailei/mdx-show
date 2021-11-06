/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled from './styled.js';

// eslint-disable-next-line react/prop-types
const Heading = React.forwardRef(({ depth, style, ...rest }, ref) => {
  let Styled;
  let objStyle = { ...style };
  switch (depth) {
    case 1:
      objStyle = {
        fontSize: '1.4em',
        ...style,
      };
      Styled = styled('h1');
      break;
    case 2:
      objStyle = {
        fontSize: '1.3em',
        ...style,
      };
      Styled = styled('h2');
      break;
    case 3:
      Styled = styled('h3');
      break;
    case 4:
      Styled = styled('h4');
      break;
    case 5:
      Styled = styled('h5');
      break;
    case 6:
      Styled = styled('h6');
      break;
    default:
      Styled = styled('h3');
  }

  return <Styled {...rest} style={objStyle} ref={ref} />;
});

Heading.propTypes = {
  depth: PropTypes.number.isRequired,
};

export default Heading;
