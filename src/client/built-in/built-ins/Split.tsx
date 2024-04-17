import type { HTMLAttributes } from 'react';
import { Error } from '../../common';

function Split(props: HTMLAttributes<HTMLDivElement>) {
  const { children, style } = props;
  const isArray = children instanceof Array;
  if (!isArray || children.length < 2) {
    return <Error>At least 2 children are required</Error>;
  }

  const objStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${children.length}, 1fr)`,
    ...style,
  };

  return <div style={objStyle}>{children}</div>;
}

export default Split;
