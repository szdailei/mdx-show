import React, { useState, useImperativeHandle } from 'react';
import { Div } from '../styled/index.js';
import classes from './Message.module.css';

// eslint-disable-next-line react/prop-types
const Message = React.forwardRef(({ className, ...rest }, ref) => {
  const [children, setChildren] = useState();

  useImperativeHandle(ref, () => ({
    setChildren: (msg) => {
      setChildren(msg);
    },
  }));

  return (
    <Div className={`${classes.message} ${className}`} {...rest} ref={ref}>
      {children}
    </Div>
  );
});

export default Message;
