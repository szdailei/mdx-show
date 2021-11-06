function separateHashAndSearch(path) {
  const parsedPath = {};

  let leftPath = path;
  const hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    parsedPath.hash = path.substr(hashIndex);
    leftPath = path.substr(0, hashIndex);
  }

  const searchIndex = path.indexOf('?');
  if (searchIndex >= 0) {
    parsedPath.search = path.substr(searchIndex);
    leftPath = path.substr(0, searchIndex);
  }

  if (leftPath) {
    parsedPath.leftPath = leftPath;
  }

  return parsedPath;
}

export default separateHashAndSearch;
