import React from 'react';
import makeid from '../lib/makeid.js';

function Code(text) {
  return <code key={makeid()}>{text}</code>;
}

export default Code;
