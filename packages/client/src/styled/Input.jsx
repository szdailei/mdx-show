import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

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
        margin: '0 0.8em 0 0.8em',
        ...style,
      };
      break;
    default:
      objStyle = {
        fontSize: '1em',
        cursor: 'text',
        outline: 0,
        borderStyle: 'none none solid none',
        ...style,
      };
      break;
  }

  const Styled = styled.input(objStyle);

  return <Styled type={type} {...rest} ref={ref} />;
});

Input.propTypes = {
  type: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};

export default Input;
