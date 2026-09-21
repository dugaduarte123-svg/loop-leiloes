import Url from 'urlinator/Url';
export const getWindowLocation = () => new Url(window.location.href);