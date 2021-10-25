// This file MUST be in root directory.
function getRootDir() {
  return new URL('.', import.meta.url).pathname;
}

export default getRootDir;
