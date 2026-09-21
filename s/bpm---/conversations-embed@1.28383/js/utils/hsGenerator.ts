function mathRandomUuid() {
  let d = new Date().getTime();
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // eslint-disable-next-line no-bitwise
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
}
/* eslint-endable no-bitwise */

function cryptoUuid() {
  const cryptoLib = window.crypto || window.msCrypto;
  const buf = new Uint16Array(8);
  cryptoLib.getRandomValues(buf);
  const S4 = num => {
    let ret = num.toString(16);
    while (ret.length < 4) {
      ret = `0${ret}`;
    }
    return ret;
  };
  return S4(buf[0]) + S4(buf[1]) + S4(buf[2]) + S4(buf[3]) + S4(buf[4]) + S4(buf[5]) + S4(buf[6]) + S4(buf[7]);
}
export function getUuid() {
  var _window;
  const cryptoLib = window.crypto || window.msCrypto;
  if (!!(cryptoLib !== null && cryptoLib !== void 0 && cryptoLib.getRandomValues) && !((_window = window) !== null && _window !== void 0 && _window.Uint16Array)) {
    return cryptoUuid();
  }
  return mathRandomUuid();
}