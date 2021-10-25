import React from 'react';
import PropTypes from 'prop-types';
import { Button, Div, Span, Input, Label } from '../styled';
import { Title } from '../sectioning';
import { Appear, Clock, Timer, ClockOrTimer, Split } from '../components';
import makeid from '../lib/makeid';
import { getTextFromChildren } from './parse-jsx-utils';

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
      return <Clock style={params} />;
    case 'Timer':
      return <Timer style={params} />;
    case 'ClockOrTimer':
      return <ClockOrTimer style={params} />;
    case 'Split':
      return <Split style={params}>{children}</Split>;
    case 'Div':
      return <Div style={params}>{children}</Div>;
    case 'Header':
      return <Span style={{ fontSize: '1.4em', fontWeight: '500', ...params }}>{children}</Span>;
    case 'Footer':
    case 'Span':
      return <Span style={params}>{children}</Span>;
    case 'Title':
      return <Title style={params}>{getTextFromChildren(children)}</Title>;
    case 'Button':
      return <Button {...params}>{children}</Button>;
    case 'Appear': {
      const propNames = ['id', 'hover', 'wrap'];
      const { props, rest } = destructuringParams(propNames, params);
      return (
        <Appear {...props} style={rest}>
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
      return <Input {...props} style={rest} />;
    }
    case 'Label': {
      const propNames = ['id', 'htmlFor'];
      const { props, rest } = destructuringParams(propNames, params);
      return (
        <Label {...props} style={rest}>
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

MDXToReactHOC.createComponent = (node) => {
  const component = (
    <MDXToReactHOC key={makeid()} tag={node.tagName} params={node.params}>
      {node.children}
    </MDXToReactHOC>
  );
  return component;
};

export default MDXToReactHOC;
