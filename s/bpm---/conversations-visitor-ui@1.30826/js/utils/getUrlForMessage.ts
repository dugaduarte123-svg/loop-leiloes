import Url from 'urlinator/Url';
export const getUrlForMessage = () => {
  const url = window.location !== window.parent.location ? document.referrer : document.location.origin;
  const parsedUrl = new Url(url);
  return (parsedUrl.hostname || '') + parsedUrl.pathname;
};