import React from 'react';
import PropTypes from 'prop-types';
import { Button, Div, Span, Input, Label, TextArea } from '../styled/index.js';
import { Title } from '../sectioning/index.js';
import { Appear, Clock, Timer, ClockOrTimer, Split } from '../components/index.js';
import makeid from '../utils/makeid.js';
import { getTextFromChildren } from './parse-jsx-utils.js';

function destructuringParams(propNames, params) {
  const clonedParams = { ...params };
  const props = {};
  propNames.forEach((propName) => {
    if (clonedParams[propName]) {
      props[propName] = clonedParams[propName];
      delete clonedParams[propName];
    }
  });
  const result = {
    props,
    rest: clonedParams,
  };
  return result;
}

function MDXToReactHOC({ children, tag, params }) {
  switch (tag) {
    case 'Clock':
      return <Clock key={makeid()} style={params} />;
    case 'Timer':
      return <Timer key={makeid()} style={params} />;
    case 'ClockOrTimer':
      return <ClockOrTimer key={makeid()} style={params} />;
    case 'Split':
      return (
        <Split key={makeid()} style={params}>
          {children}
        </Split>
      );
    case 'Div':
      return (
        <Div key={makeid()} style={params}>
          {children}
        </Div>
      );
    case 'Header':
      return (
        <Div key={makeid()} style={{ fontSize: '1.4em', fontWeight: '500', ...params }}>
          {children}
        </Div>
      );
    case 'Footer':
      return (
        <Div key={makeid()} style={params}>
          {children}
        </Div>
      );
    case 'Span':
      return (
        <Span key={makeid()} style={params}>
          {children}
        </Span>
      );
    case 'Title':
      return (
        <Title key={makeid()} style={params}>
          {getTextFromChildren(children)}
        </Title>
      );
    case 'Button':
      return (
        <Button key={makeid()} {...params}>
          {children}
        </Button>
      );
    case 'Appear': {
      const propNames = ['id', 'hover', 'wrap'];
      const { props, rest } = destructuringParams(propNames, params);
      return (
        <Appear key={makeid()} {...props} style={rest}>
          {children}
        </Appear>
      );
    }
    case 'Input': {
      const propNames = [
        'id',
        'autoComplete',
        'autoFocus',
        'type',
        'name',
        'checked',
        'placeholder',
        'readOnly',
        'required',
        'size',
        'src',
      ];
      const { props, rest } = destructuringParams(propNames, params);
      return <Input key={makeid()} {...props} style={rest} />;
    }
    case 'TextArea': {
      return <TextArea key={makeid()} />;
    }
    case 'Label': {
      const propNames = ['id', 'htmlFor'];
      const { props, rest } = destructuringParams(propNames, params);
      return (
        <Label key={makeid()} {...props} style={rest}>
          {children}
        </Label>
      );
    }
    default:
      throw new TypeError(`Unknown tag of ${tag}`);
  }
}

MDXToReactHOC.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  params: PropTypes.object.isRequired,
};

MDXToReactHOC.createComponentByNode = (node) => {
  const component = (
    <MDXToReactHOC key={makeid()} tag={node.tagName} params={node.params}>
      {node.children}
    </MDXToReactHOC>
  );
  return component;
};

export default MDXToReactHOC;
