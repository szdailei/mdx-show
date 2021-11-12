import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '../styled/index.js';

// eslint-disable-next-line react/prop-types
const Split = React.forwardRef(({ children, style, ...rest }, ref) => {
  const objStyle = { ...style };
  objStyle.gridTemplateRows = objStyle.gridTemplateRows || '1fr';
  objStyle.gridTemplateColumns = objStyle.gridTemplateColumns || `repeat(${children.length}, 1fr)`;
  objStyle.alignItems = objStyle.alignItems || 'end';

  return (
    <Grid {...rest} style={objStyle} ref={ref}>
      {children}
    </Grid>
  );
});

Split.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Split;
