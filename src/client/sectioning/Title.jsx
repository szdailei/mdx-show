import React from 'react';
import PropTypes from 'prop-types';
import styled from '../styled/styled.js';

// eslint-disable-next-line react/prop-types
const Title = React.forwardRef(({ children, style, ...rest }, ref) => {
  document.title = children;

  const objStyle = {
    textAlign: 'center',
    marginTop: '3em',
    fontSize: '2.4em',
    fontWeight: '700',
    ...style,
  };
  const Styled = styled('div');
  return (
    <Styled id="title" {...rest} style={objStyle} ref={ref}>
      {children}
    </Styled>
  );
});

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Title;
