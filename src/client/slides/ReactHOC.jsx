import React from 'react';
import PropTypes from 'prop-types';
import { Player } from '../components/index.js';
import { makeid } from '../utils/index.js';
import { realSrc,isFileUrl } from '../markdown/index.js';
import MDXToReactHOC from './MDXToReactHOC.jsx';

function ReactHOC({ children, tag, attrs }) {
  switch (tag) {
    case 'br':
      return <br key={makeid()} />;
    case 'del':
      return <del key={makeid()}>{children}</del>;
    case 'strong':
      return <strong key={makeid()}>{children}</strong>;
    case 'code':
      return <code key={makeid()}>{children}</code>;
    case 'div':
      return (
        <div key={makeid()} {...attrs}>
          {children}
        </div>
      );
    case 'span':
      return (
        <span key={makeid()} {...attrs}>
          {children}
        </span>
      );
    case 'hr':
      return <hr key={makeid()} />;
    case 'source':
      // eslint-disable-next-line no-param-reassign
      attrs.src = realSrc(attrs.src, 'video');
      return <source key={makeid()} {...attrs} />;
    case 'track':
      // eslint-disable-next-line no-param-reassign
      attrs.src = realSrc(attrs.src, 'video');
      return <track key={makeid()} {...attrs} />;
    case 'video': {
      if (attrs.poster) {
        // eslint-disable-next-line no-param-reassign
        attrs.poster = realSrc(attrs.poster, 'img');
      }
      if (!isFileUrl()){
        // eslint-disable-next-line no-param-reassign
        attrs.crossOrigin = 'anonymous'
      }
      return (
        <Player key={makeid()} {...attrs}>
          {children}
        </Player>
      );
    }
    case 'u':
      return <u key={makeid()}>{children}</u>;
    case '#text':
      return children;
    default: {
      const params = attrs;
      return MDXToReactHOC({ children, tag, params });
    }
  }
}

ReactHOC.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  attrs: PropTypes.object.isRequired,
};

ReactHOC.createComponentByNode = (node) => {
  const component = (
    <ReactHOC key={makeid()} tag={node.tagName} attrs={node.params}>
      {node.children}
    </ReactHOC>
  );
  return component;
};

export default ReactHOC;
