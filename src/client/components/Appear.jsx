import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Div } from '../styled/index.js';

// eslint-disable-next-line react/prop-types
const Appear = React.forwardRef(({ children, hover, wrap, style, ...rest }, ref) => {
  const firstChild = children[0];
  const restChildren = children.slice(1, children.length);
  const objStyle = {
    cursor: 'pointer',
    ...style,
  };
  const [stateOfShown, setStateOfShown] = useState(false);

  const onMouseEnter = useCallback((event) => {
    event.preventDefault();
    setStateOfShown(true);
  }, []);
  const onMouseLeave = useCallback((event) => {
    event.preventDefault();
    setStateOfShown(false);
  }, []);
  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      setStateOfShown(!stateOfShown);
    },
    [stateOfShown]
  );

  let eventHandlers;
  if (hover) {
    eventHandlers = {
      onMouseEnter,
      onMouseLeave,
    };
  } else {
    eventHandlers = { onClick };
  }

  const wrapStyle = { ...objStyle };
  wrapStyle.width = wrapStyle.width || 'fit-content';

  const firstChildWrapStyle = { ...children[0].props.style };
  firstChildWrapStyle.width = firstChildWrapStyle.width || 'fit-content';

  const secondChildWrap = stateOfShown ? <Div>{restChildren}</Div> : null;

  let firstChildWrap;
  if (wrap) {
    firstChildWrap = <Div style={firstChildWrapStyle}> {firstChild}</Div>;
    return (
      <Div {...rest} style={wrapStyle} {...eventHandlers} ref={ref}>
        {firstChildWrap}
        {secondChildWrap}
      </Div>
    );
  }

  firstChildWrap = (
    <Div {...eventHandlers} style={firstChildWrapStyle}>
      {children[0]}
    </Div>
  );
  return (
    <Div {...rest} style={wrapStyle} ref={ref}>
      {firstChildWrap}
      {secondChildWrap}
    </Div>
  );
});

Appear.propTypes = {
  children: PropTypes.node.isRequired,
  hover: PropTypes.bool,
  wrap: PropTypes.bool,
};

Appear.defaultProps = {
  hover: false,
  wrap: false,
};

export default Appear;
