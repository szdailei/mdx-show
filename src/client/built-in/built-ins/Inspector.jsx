import React, { useState, useImperativeHandle } from 'react';
import { chromeDark, ObjectInspector } from 'react-inspector';
import makeid from '../../utils/makeid';

export const inspectorContext = {
  ref: { current: null },
  inspectorList: [],
};

function createExpandPaths(inspectorList) {
  const expandPaths = ['$', '$.*'];

  inspectorList.forEach((inspector, index) => {
    const keys = Object.keys(inspector);
    keys.forEach((key) => {
      if (key === 'callStack') return;
      const path = `$.${index}.${key}`;
      expandPaths.push(path);
      const nextPath = `$.${index}.${key}.*`;
      expandPaths.push(nextPath);
    });
  });
  return expandPaths;
}

const Inspector = React.forwardRef((props, ref) => {
  const [changed, setChanged] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      update: () => {
        setChanged(!changed);
      },
    }),
    [changed]
  );

  const fontSize = '20px';
  const theme = {
    ...chromeDark,
    ...{
      ARROW_FONT_SIZE: fontSize,
      BASE_FONT_SIZE: fontSize,
      TREENODE_FONT_SIZE: fontSize,
    },
  };
  const expandPaths = createExpandPaths(inspectorContext.inspectorList);

  return (
    <ObjectInspector
      key={makeid()}
      name="inspecting"
      data={inspectorContext.inspectorList}
      theme={theme}
      expandPaths={expandPaths}
      sortObjectKeys
    />
  );
});

export default Inspector;
