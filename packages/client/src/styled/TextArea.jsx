import React, { useCallback } from 'react';
import styled from './styled';

// eslint-disable-next-line react/prop-types
const TextArea = React.forwardRef(({ style, ...rest }, ref) => {
  const minRows = 5;
  const onChange = useCallback((event) => {
    const currentRows = event.target.value.split('\n').length;
    // eslint-disable-next-line no-param-reassign
    if (currentRows > minRows) event.target.rows = currentRows;
  }, []);

  const objStyle = {
    fontSize: '1em',
    transition: 'all 0.3s',
    outline: 0,
    border: '1px dashed',
    ...style,

    '&:focus': {
      border: '1px double blue',
      borderRadius: '8px',
      boxShadow: '1px 1px 2px blue',
    },
  };

  const Styled = styled('textarea');
  return <Styled {...rest} style={objStyle} onChange={onChange} rows={minRows} ref={ref} />;
});

export default TextArea;
