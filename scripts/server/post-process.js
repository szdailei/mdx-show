import { transform } from 'esbuild';
import removeCodeInsideToken from './remove-code-inside-token.js';

async function postProcess(text) {
  //! [PositionForDevCodeBegin]
  //! The code will be removed
  //! [PositionForDevCodeEnd]
  const tokenOfComment = '//!';
  const tokenOfDevCodeBegin = '[PositionForDevCodeBegin]';
  const tokenOfDevCodeEnd = '[PositionForDevCodeEnd]';

  const prodCode = removeCodeInsideToken(text, tokenOfComment, tokenOfDevCodeBegin, tokenOfDevCodeEnd);

  const options = { platform: 'node', minify: false };
  const result = await transform(prodCode, options);
  return result.code;
}

export default postProcess;
