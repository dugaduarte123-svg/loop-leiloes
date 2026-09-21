export const checkNetwork = () => {
  return Promise.resolve({
    online: navigator.onLine
  });
};