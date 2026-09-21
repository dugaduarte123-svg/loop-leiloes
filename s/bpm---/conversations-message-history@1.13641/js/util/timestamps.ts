export const generateUniqueClientTimestamp = function generateUniqueClientTimestamp(namespace = 'default') {
  const now = Date.now();
  const {
    previousTimestamps
  } = generateUniqueClientTimestamp;
  if (previousTimestamps && previousTimestamps[namespace] && previousTimestamps[namespace] >= now) {
    previousTimestamps[namespace]++;
    return previousTimestamps[namespace];
  }
  previousTimestamps[namespace] = now;
  return now;
};
generateUniqueClientTimestamp.previousTimestamps = {};
generateUniqueClientTimestamp.reset = function () {
  this.previousTimestamps = {};
};