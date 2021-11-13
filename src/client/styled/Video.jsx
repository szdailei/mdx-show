/* eslint-disable no-param-reassign */
import React from 'react';
import styled from './styled.js';

// eslint-disable-next-line react/prop-types
const Video = React.forwardRef(({ saveViewPortCallback, style, ...rest }, ref) => {
  const props = {
    crossOrigin: 'anonymous',
    controls: true,
    preload: 'auto',
    ...rest,
  };

  const objStyle = {
    display: 'block',
    margin: 'auto',
    ...style,
  };

  const Styled = styled('video');
  return <Styled {...props} style={objStyle} ref={ref} />;
});

export default Video;
