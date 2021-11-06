import React from 'react';
import makeid from '../lib/makeid.js';
import { TH, TD, TR, THead, TBody, Table } from '../styled/index.js';
import parseText from './parse-one-line-text.js';

function parseTDWithHtml(text) {
  return parseText(text);
}

function TableNode(table) {
  const padding = '6px 16px 6px 16px';
  const backgroundColor = 'linen';

  const tHeaders = [];
  table.header.forEach((header) => {
    tHeaders.push(
      <TH key={makeid()} style={{ padding, backgroundColor }}>
        {header.text}
      </TH>
    );
  });
  const tHeadNode = (
    <THead key={makeid()}>
      <TR key={makeid()}>{tHeaders}</TR>
    </THead>
  );

  const tBodyRows = [];
  let isRequiredBackground = false;
  table.rows.forEach((rowCells) => {
    const dataCells = [];
    rowCells.forEach((cell) => {
      const tDChildren = parseTDWithHtml(cell.text);
      dataCells.push(
        <TD key={makeid()} style={{ padding }}>
          {tDChildren}
        </TD>
      );
    });

    const trNode = isRequiredBackground ? (
      <TR key={makeid()} style={{ backgroundColor }}>
        {dataCells}
      </TR>
    ) : (
      <TR key={makeid()}>{dataCells}</TR>
    );
    tBodyRows.push(trNode);
    isRequiredBackground = !isRequiredBackground;
  });
  const tBodyNode = <TBody key={makeid()}>{tBodyRows}</TBody>;

  const node = (
    <Table key={makeid()}>
      {tHeadNode}
      {tBodyNode}
    </Table>
  );

  return node;
}

export default TableNode;
