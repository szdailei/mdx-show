import React from 'react';
import makeid from '../utils/makeid.js';

function Code(text) {
  return <code key={makeid()}>{text}</code>;
}

export default Code;
