import React, { useState, type ForwardedRef, type ChangeEvent, TextareaHTMLAttributes } from 'react';

const TextArea = React.forwardRef(
  (props: TextareaHTMLAttributes<HTMLTextAreaElement>, ref: ForwardedRef<typeof TextArea>) => {
    const [focused, setFocused] = useState<boolean>();

    const minRows = 5;
    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const currentRows = event.target.value.split('\n').length;
      // eslint-disable-next-line no-param-reassign
      if (currentRows > minRows) event.target.rows = currentRows;
    };
    const onFucus = () => {
      setFocused(true);
    };
    const onBlur = () => {
      setFocused(false);
    };

    const style = {
      caretColor: 'red',
      fontSize: '1em',
      transition: 'all 0.3s',
      outline: '0',
      border: '1px dashed',
      ...props.style,
    };
    const focusedStyle = {
      ...style,
      border: '1px double blue',
      borderRadius: '8px',
      boxShadow: '1px 1px 2px blue',
    };

    const textAreaStyle = focused ? focusedStyle : style;
    const forwardProps = { ...props, style: textAreaStyle };

    return (
      <textarea rows={minRows} onChange={onChange} onFocus={onFucus} onBlur={onBlur} {...forwardProps} ref={ref} />
    );
  }
);

export default TextArea;
