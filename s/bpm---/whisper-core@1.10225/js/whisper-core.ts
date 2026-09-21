/**
 * IMPORTANT: This file serves as a wrapper for whisper-core and is served via livePaths.
 * Since livePaths doesn't support long-term frontend caching, we need to keep imports
 * from whisper-core to a minimum. This architecture allows whisper-core.js to leverage
 * frontend caching while this wrapper file handles dynamic loading through livePaths.
 */
const loadScript = src => {
  const s = document.createElement('script');
  const removeScript = () => document.head.removeChild(s);
  s.src = src;
  s.crossOrigin = 'anonymous';
  s.onload = removeScript;
  s.onerror = removeScript;
  document.head.appendChild(s);
};
loadScript(`${__webpack_public_path__}whisper-core-entry.js`);