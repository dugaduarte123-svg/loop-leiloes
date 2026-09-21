// Check for a 32 character UTK.  Eg be0257d806634aedbe9eb4537e05830a
export const UTK_REGEX = /[a-zA-Z\d]{32}/;
export function isUtk(uuid) {
  return UTK_REGEX.test(uuid);
}