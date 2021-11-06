function isValidCharAfterRestPath(char) {
  if (char === '/') return true;
  return false;
}

function match(url, routers) {
  for (let i = 0; i < routers.length; i += 1) {
    if (url.indexOf(routers[i].path) === 0) {
      const nextChar = url[routers[i].path.length];
      if (!nextChar || isValidCharAfterRestPath(nextChar)) {
        const matched = {
          index: i,
          path: routers[i].path,
          func: routers[i].func,
        };
        return matched;
      }
    }
  }
  return {};
}

export default match;
