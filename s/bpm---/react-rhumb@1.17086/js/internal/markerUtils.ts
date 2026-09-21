export function getRelativeMarkerTimings(checks, routeStartTimestamp) {
  const timings = {};
  Object.keys(checks).forEach(marker => {
    if (checks[marker]) {
      timings[marker] = checks[marker].timestamp - routeStartTimestamp;
    }
  });
  return timings;
}