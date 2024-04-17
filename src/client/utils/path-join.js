function join(dir, path, options) {
  const { backendOsType } = options;
  switch (backendOsType) {
    case 'Linux':
      return `${dir}/${path}`;
    case 'Windows':
      return `${dir}\${path}`;
    default:
      throw new RangeError(`Unsupported platform: ${backendOsType}`);
  }
}

export default join;
