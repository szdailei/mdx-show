/* eslint-disable react/prop-types */
import React from 'react';
import styled from '@emotion/styled';

const TH = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled.th(style);
  return <Styled {...rest} ref={ref} />;
});

const TD = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled.td(style);
  return <Styled {...rest} ref={ref} />;
});

const TR = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    borderBottom: '1px solid',
    ...style,
  };

  const Styled = styled.tr(objStyle);
  return <Styled {...rest} ref={ref} />;
});

const THead = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled.thead(style);
  return <Styled {...rest} ref={ref} />;
});

const TBody = React.forwardRef(({ style, ...rest }, ref) => {
  const Styled = styled.tbody(style);
  return <Styled {...rest} ref={ref} />;
});

const Table = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    borderCollapse: 'collapse',
    ...style,
  };

  const Styled = styled.table(objStyle);
  return <Styled {...rest} ref={ref} />;
});

export { TH, TD, TR, THead, TBody, Table };
