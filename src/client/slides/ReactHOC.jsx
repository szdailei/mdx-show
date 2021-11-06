import React from 'react';
import PropTypes from 'prop-types';
import makeid from '../lib/makeid.js';
import { getRealSrc } from '../markdown/markdown.js';
import { VideoJS } from '../components/index.js';
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
      attrs.src = getRealSrc(attrs.src, 'video');
      return <source key={makeid()} {...attrs} />;
    case 'track':
      // eslint-disable-next-line no-param-reassign
      attrs.src = getRealSrc(attrs.src, 'video');
      return <track key={makeid()} {...attrs} />;
    case 'u':
      return <u key={makeid()}>{children}</u>;
    case 'video': {
      const options = {
        crossOrigin: 'anonymous',
        controls: true,
        preload: 'auto',
        width: attrs.width,
        height: attrs.height,
      };
      return (
        <VideoJS key={makeid()} options={options}>
          {children}
        </VideoJS>
      );
    }
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
