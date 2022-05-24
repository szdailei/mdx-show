/* eslint-disable react/forbid-prop-types */
import React, { useState, useCallback, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeid } from '../utils/index.js';
import { Button, Div, Grid, TextArea } from '../styled/index.js';
import { Message } from '../components/index.js';

const Parsed = React.forwardRef((_, ref) => {
  const [children, setChildren] = useState();

  useImperativeHandle(ref, () => ({
    setChildren: (firstPageMain) => {
      setChildren(firstPageMain);
    },
  }));

  return <Div ref={ref}>{children}</Div>;
});

const ParseButton = React.forwardRef(({ createPages, textAreaRef, parsedRef, messageRef }, ref) => {
  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      let firstPageMain;
      let elementCount;

      try {
        const { pages } = createPages(textAreaRef.current.value);
        const [firstPage] = pages;
        firstPageMain = { ...firstPage.props.main };
        elementCount = firstPageMain.props.children.length;
      } catch (error) {
        firstPageMain = error.toString();
        elementCount = 0;
      }

      const parseMessage = <Div style={{ color: 'red', fontSize: '0.8em' }}>解析出{elementCount}个元素</Div>;

      messageRef.current.setChildren(parseMessage);
      parsedRef.current.setChildren(firstPageMain);
    },
    [createPages, textAreaRef, parsedRef, messageRef]
  );

  return (
    <Button onClick={onClick} style={{ marginLeft: '0.5em', marginRight: '0.5em' }} ref={ref}>
      解析
    </Button>
  );
});

ParseButton.propTypes = {
  createPages: PropTypes.func.isRequired,
  textAreaRef: PropTypes.object.isRequired,
  parsedRef: PropTypes.object.isRequired,
  messageRef: PropTypes.object.isRequired,
};

function Example({ createPages }) {
  const textAreaRef = useRef();
  const parsedRef = useRef();
  const messageRef = useRef();

  const onKeyUp = useCallback((event) => {
    event.nativeEvent.stopImmediatePropagation();
  }, []);

  const gridStyle = {
    gridTemplateColumns: 'auto min-content max-content',
  };

  return (
    <>
      <Grid style={gridStyle}>
        <TextArea onKeyUp={onKeyUp} ref={textAreaRef} />
        <ParseButton
          createPages={createPages}
          textAreaRef={textAreaRef}
          parsedRef={parsedRef}
          messageRef={messageRef}
        />
        <Message ref={messageRef} />
      </Grid>
      <Parsed ref={parsedRef} />
    </>
  );
}

Example.propTypes = {
  createPages: PropTypes.func.isRequired,
};

Example.createComponent = (createPages) => <Example key={makeid()} createPages={createPages} />;

function isExampleTag(tagName) {
  return tagName === 'Example';
}

export default Example;

export { isExampleTag };
