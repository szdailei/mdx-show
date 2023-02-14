function makeid() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0, length = 16, charsLength = characters.length; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
}

export default makeid;
