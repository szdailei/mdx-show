import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Div } from '../styled';

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

  let eventHandles;
  if (hover) {
    eventHandles = {
      onMouseEnter,
      onMouseLeave,
    };
  } else {
    eventHandles = { onClick };
  }

  const containerDivStyle = { ...objStyle };
  containerDivStyle.width = containerDivStyle.width || 'fit-content';

  const firstChildContainerStyle = { ...children[0].props.style };
  firstChildContainerStyle.width = firstChildContainerStyle.width || 'fit-content';

  const secondChildContainer = stateOfShown ? <Div>{restChildren}</Div> : null;

  let firstChildContainer;
  if (wrap) {
    firstChildContainer = <Div style={firstChildContainerStyle}> {firstChild}</Div>;
    return (
      <Div {...rest} style={containerDivStyle} {...eventHandles} ref={ref}>
        {firstChildContainer}
        {secondChildContainer}
      </Div>
    );
  }

  firstChildContainer = (
    <Div {...eventHandles} style={firstChildContainerStyle}>
      {children[0]}
    </Div>
  );
  return (
    <Div {...rest} style={containerDivStyle} ref={ref}>
      {firstChildContainer}
      {secondChildContainer}
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
