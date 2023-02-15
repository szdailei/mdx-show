/* eslint-disable react/prop-types */
import React, { useState, useRef, type HTMLAttributes, type MouseEvent } from 'react';
import makeid from '../../utils/makeid';
import TextArea from './TextArea';
import type { ReactElementWithhChildren, MdxToReact } from '../../slides/html-jsx-to-react/index.d';

export type PlayGroundProps = HTMLAttributes<unknown> & {
  mdxToReact: MdxToReact;
  jsCode: string;
  placeholder: string;
  defaultValue: string;
};

export default function PlayGround(props: PlayGroundProps) {
  const [elements, setElements] = useState<ReactElementWithhChildren[]>();
  const textAreaRef = useRef<HTMLTextAreaElement>();

  const { mdxToReact, jsCode, placeholder, defaultValue, style, ...rest } = props;
  const playGroundStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto min-content',
    ...style,
  };

  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    let result: ReactElementWithhChildren[] = [];
    try {
      result = mdxToReact(textAreaRef.current.value, jsCode);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const eleProps = {
        key: makeid(),
      };
      const element = React.createElement('p', eleProps, msg);
      result.push(element);
    }

    setElements(result);
  };

  const placeholderValue = placeholder || 'Input MDX and press "Run" button';

  return (
    <>
      <div {...rest} style={playGroundStyle}>
        <TextArea placeholder={placeholderValue} defaultValue={defaultValue} ref={textAreaRef} />
        <button type="button" onClick={onClick} style={{ backgroundColor: 'darkred', color: 'white' }}>
          Run
        </button>
      </div>
      <div>{elements}</div>
    </>
  );
}
