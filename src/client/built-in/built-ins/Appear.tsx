import { useState, type ReactElement, type HTMLAttributes, type MouseEvent } from 'react';
import { Error } from '../../common';

type Props = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  eventOnParent?: boolean;
};

export default function Appear(props: Props) {
  const [stateOfShown, setStateOfShown] = useState(false);

  const onMouseEnter = (event: MouseEvent) => {
    event.preventDefault();
    setStateOfShown(true);
  };
  const onMouseLeave = (event: MouseEvent) => {
    event.preventDefault();
    setStateOfShown(false);
  };
  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    setStateOfShown(!stateOfShown);
  };

  const { children, hover, style, eventOnParent } = props;
  const isArray = children instanceof Array;
  if (!isArray || children.length < 2) {
    return <Error>At least 2 children are required</Error>;
  }

  const firstChild = children[0] as ReactElement;
  const restChildren = children.slice(1, children.length);
  let eventHandlers: object;
  if (hover) {
    eventHandlers = {
      onMouseEnter,
      onMouseLeave,
    };
  } else {
    eventHandlers = { onClick };
  }

  const secondChild = stateOfShown ? <div>{restChildren}</div> : null;

  const appearStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, max-content)',
    gridGap: '2em',
    ...style,
  };

  if (eventOnParent) {
    return (
      <div {...eventHandlers} style={appearStyle}>
        {firstChild}
        {secondChild}
      </div>
    );
  }

  const firstChildWrap = <div {...eventHandlers}>{firstChild}</div>;
  return (
    <div style={appearStyle}>
      {firstChildWrap}
      {secondChild}
    </div>
  );
}

Appear.defaultProps = {
  hover: false,
  eventOnParent: false,
};
