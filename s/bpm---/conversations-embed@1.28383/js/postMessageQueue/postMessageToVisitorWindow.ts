export const postMessageToVisitorWindow = ({
  targetWindow,
  iframeSrc,
  type,
  data
}) => {
  if (targetWindow.closed) {
    return;
  }
  return targetWindow.postMessage(JSON.stringify({
    type,
    data
  }), iframeSrc);
};