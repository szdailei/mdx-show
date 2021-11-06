import clone from 'rfdc';

function deepClone(original) {
  //  const clone = global.structuredClone(original);
  return clone(original);
}

export default deepClone;
