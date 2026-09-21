export const timestampIsTomorrow = timestamp => {
  const date = new Date(timestamp);
  const now = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1).valueOf() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
};