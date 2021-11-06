function isStartFromSpecialRoot({ path, root }) {
  if (path.indexOf(root) === 0) return true;
  return false;
}

function hasRight({ path, root }) {
  const canAcess = isStartFromSpecialRoot({ path, root });
  if (canAcess) return true;
  return false;
}

export default hasRight;
