import React from 'react';
import PropTypes from 'prop-types';
import styled from './styled.js';

// eslint-disable-next-line react/prop-types
const Input = React.forwardRef(({ type, style, ...rest }, ref) => {
  let objStyle;

  switch (type) {
    case 'checkbox':
    case 'radio':
      objStyle = {
        fontSize: '1em',
        width: '1em',
        height: '1em',
        margin: '0 0.8em',
        ...style,
      };
      break;
    default:
      objStyle = {
        fontSize: '1em',
        cursor: 'text',
        outline: 0,
        borderStyle: 'none none solid',
        ...style,
      };
      break;
  }

  const Styled = styled('input');

  return <Styled type={type} {...rest} style={objStyle} ref={ref} />;
});

Input.propTypes = {
  type: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};

export default Input;
