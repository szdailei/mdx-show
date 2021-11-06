/* eslint-disable react/prop-types */
import React from 'react';
import styled from './styled.js';

const TH = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled('th');
  return <Styled {...rest} style={style} ref={ref} />;
});

const TD = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled('td');
  return <Styled {...rest} style={style} ref={ref} />;
});

const TR = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    borderBottom: '1px solid',
    ...style,
  };

  const Styled = styled('tr');
  return <Styled {...rest} style={objStyle} ref={ref} />;
});

const THead = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled('thead');
  return <Styled {...rest} style={style} ref={ref} />;
});

const TBody = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled('tbody');
  return <Styled {...rest} style={style} ref={ref} />;
});

const Table = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    borderCollapse: 'collapse',
    margin: 'auto',
    ...style,
  };

  const Styled = styled('table');
  return <Styled {...rest} style={objStyle} ref={ref} />;
});

export { TH, TD, TR, THead, TBody, Table };
