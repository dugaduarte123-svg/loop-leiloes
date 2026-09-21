export const visibilityState = () => document.visibilityState;
export const isHidden = () => document.visibilityState === 'hidden';
export const wasHiddenOnScriptStart = isHidden();
export const getWasHiddenOnScriptStart = () => wasHiddenOnScriptStart;
export const onVisibilityChange = callback => {
  const handler = () => callback(document.visibilityState);
  document.addEventListener('visibilitychange', handler);
  return () => document.removeEventListener('visibilitychange', handler);
};
export const onVisibilityHidden = callback => {
  const handler = () => {
    if (document.visibilityState === 'hidden') {
      callback();
    }
  };
  document.addEventListener('visibilitychange', handler);
  return () => document.removeEventListener('visibilitychange', handler);
};