/* eslint-disable react/forbid-prop-types */
import React, { useState, useCallback, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import makeid from '../lib/makeid';
import { Button, Div, GridContainer, TextArea } from '../styled';
import { Message } from '../components';

const Example = React.forwardRef((_, ref) => {
  const [children, setChildren] = useState();

  useImperativeHandle(ref, () => ({
    setChildren: (firstPageMain) => {
      setChildren(firstPageMain);
    },
  }));

  return <Div ref={ref}>{children}</Div>;
});

const ParseButton = React.forwardRef(({ createPages, textAreaRef, exampleRef, messageRef }, ref) => {
  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      let firstPageMain;
      let elementCount;

      try {
        const pages = createPages(textAreaRef.current.value);
        const [firstPage] = pages;
        firstPageMain = { ...firstPage.props.main };
        elementCount = firstPageMain.props.children.length;
      } catch (error) {
        firstPageMain = error.toString();
        elementCount = 0;
      }

      const parseMessage = <Div style={{ color: 'red', fontSize: '0.8em' }}>解析出{elementCount}个元素</Div>;

      messageRef.current.setChildren(parseMessage);
      exampleRef.current.setChildren(firstPageMain);
    },
    [createPages, textAreaRef, exampleRef, messageRef]
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
  exampleRef: PropTypes.object.isRequired,
  messageRef: PropTypes.object.isRequired,
};

function ExampleContainer({ createPages }) {
  const textAreaRef = useRef();
  const exampleRef = useRef();
  const messageRef = useRef();

  const onKeyUp = useCallback((event) => {
    event.nativeEvent.stopImmediatePropagation();
  }, []);

  const gridContainerStyle = {
    gridTemplateColumns: 'auto min-content max-content',
  };

  const textAreaStyle = {
    caretColor: 'red',
  };

  return (
    <>
      <GridContainer style={gridContainerStyle}>
        <TextArea onKeyUp={onKeyUp} style={textAreaStyle} ref={textAreaRef} />
        <ParseButton
          createPages={createPages}
          textAreaRef={textAreaRef}
          exampleRef={exampleRef}
          messageRef={messageRef}
        />
        <Message ref={messageRef} />
      </GridContainer>
      <Example ref={exampleRef} />
    </>
  );
}

ExampleContainer.propTypes = {
  createPages: PropTypes.func.isRequired,
};

ExampleContainer.createComponent = (createPages) => <ExampleContainer key={makeid()} createPages={createPages} />;

function isExampleTag(tagName) {
  return tagName === 'Example';
}

export { ExampleContainer, isExampleTag };
