import type { HTMLProps } from 'react';
import makeid from '../../utils/makeid';
import { isVariable, removeParantheses, evalVariable } from './eval-code';
import { tagNamesShouldFocused } from '../focus-utils';

function capitalizeFirstLetter(text: string) {
  return text[0].toUpperCase() + text.slice(1);
}

function kebabCaseToCamelCase(kebabCase: string) {
  const names = kebabCase.split('-');
  if (names.length === 1) return kebabCase;

  let name = names[0];
  for (let i = 1, { length } = names; i < length; i += 1) {
    name += capitalizeFirstLetter(names[i]);
  }
  return name;
}

function styleToObj(styleText: string, jsCode?: string) {
  const styleObj = {};
  const props = styleText.split(';');

  props.forEach((origProp) => {
    try {
      const prop = origProp.trim();
      const isWhitespace = prop.length === 0;
      if (isWhitespace) return;

      const nameAndValue = prop.split(':');
      const name = kebabCaseToCamelCase(nameAndValue[0].trim());
      const value = nameAndValue[1].trim();
      styleObj[name] = evalVariable(value, jsCode);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new RangeError(`"${errorMsg}" for:\n${styleText}`);
    }
  });
  return styleObj;
}

export function attribsToString(attribs: { [s: string]: string }) {
  const id = makeid();
  const keys = Object.keys(attribs);
  let attribsString = `{key: "${id}",`;

  keys.forEach((key) => {
    let value = attribs[key];
    if (isVariable(value)) {
      value = removeParantheses(value);
      attribsString += `${key}:${value},`;
    } else {
      attribsString += `${key}:"${value}",`;
    }
  });
  attribsString += '}';
  return attribsString;
}

export function attrsToProps(attribs: { [s: string]: string }, tagName: string, js?: string) {
  const props: HTMLProps<unknown> = {
    key: makeid(),
    tabIndex: tagNamesShouldFocused.includes(tagName.toUpperCase()) ? 0 : undefined,
  };

  const keys = Object.keys(attribs);
  keys.forEach((key) => {
    const value = evalVariable(attribs[key], js);

    switch (key) {
      case 'class':
        props.className = value;
        break;
      case 'for':
        props.htmlFor = value;
        break;
      case 'style':
        props.style = styleToObj(value, js);
        break;
      case 'alt':
        props.alt = value.length === 0 ? 'No media found, wrong url or denied by server.' : value;
        break;
      default: {
        props[key] = value.length === 0 ? true : value;
        break;
      }
    }
  });

  return props;
}
