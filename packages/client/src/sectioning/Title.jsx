import React from 'react';
import PropTypes from 'prop-types';
import styled from '../styled/styled';

// eslint-disable-next-line react/prop-types
const Title = React.forwardRef(({ children, style, ...rest }, ref) => {
  document.title = children;

  const containerStyle = {
    minHeight: '60vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const itemStyle = {
    fontSize: '3em',
    fontWeight: '700',
    ...style,
  };
  const Styled = styled('div');
  const StyledItem = styled('div');
  return (
    <Styled {...rest} style={containerStyle} ref={ref}>
      <StyledItem id="title" style={itemStyle}>
        {children}
      </StyledItem>
    </Styled>
  );
});

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Title;
