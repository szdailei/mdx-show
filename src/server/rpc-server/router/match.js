function isValidCharAfterRestPath(char) {
  if (char === '/') return true;
  return false;
}

function match(url, routers) {
  for (let i = 0, { length } = routers; i < length; i += 1) {
    const router = routers[i];
    if (url.indexOf(router.url) === 0) {
      const nextChar = url[router.url.length];
      if (!nextChar || isValidCharAfterRestPath(nextChar)) {
        const matched = {
          index: i,
          url: router.url,
          func: router.func,
        };
        return matched;
      }
    }
  }
  return {};
}

export default match;
