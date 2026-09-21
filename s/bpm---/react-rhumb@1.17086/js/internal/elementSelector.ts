const GENERIC_TAGS = new Set(['div', 'span', 'section', 'main', 'header', 'footer', 'nav', 'article', 'aside', 'p', 'li', 'ul', 'ol']);
const MAX_CLASSES = 3;
const MAX_ANCESTOR_DEPTH = 5;
const MAX_ARIA_LABEL_LENGTH = 40;
const MAX_COMPONENT_NAME_DEPTH = 100;
function getAttr(el, attr) {
  return el.getAttribute(attr) || '';
}
function buildSelfSelector(el) {
  var _el$tagName, _el$tagName$toLowerCa;
  const tag = (_el$tagName = el.tagName) === null || _el$tagName === void 0 || (_el$tagName$toLowerCa = _el$tagName.toLowerCase) === null || _el$tagName$toLowerCa === void 0 ? void 0 : _el$tagName$toLowerCa.call(_el$tagName);
  if (!tag) {
    return '';
  }
  let selector = tag;
  if (el.id) {
    selector += `#${el.id}`;
  }
  const classNames = getAttr(el, 'class');
  if (classNames.trim()) {
    const classes = classNames.trim().split(/\s+/);
    selector += `.${classes.slice(0, MAX_CLASSES).join('.')}`;
    if (classes.length > MAX_CLASSES) {
      selector += '...';
    }
  }
  const testId = getAttr(el, 'data-test-id');
  if (testId) {
    selector += `[data-test-id="${testId}"]`;
  }
  const role = getAttr(el, 'role');
  if (role && role !== 'presentation' && role !== 'none') {
    selector += `[role="${role}"]`;
  }
  const ariaLabel = getAttr(el, 'aria-label');
  if (ariaLabel) {
    const label = ariaLabel.length > MAX_ARIA_LABEL_LENGTH ? `${ariaLabel.slice(0, MAX_ARIA_LABEL_LENGTH)}...` : ariaLabel;
    selector += `[aria-label="${label}"]`;
  }
  if (['input', 'textarea', 'select'].includes(tag)) {
    const name = getAttr(el, 'name');
    if (name) {
      selector += `[name="${name}"]`;
    }
  }
  if (tag === 'img') {
    const alt = getAttr(el, 'alt');
    if (alt) {
      const truncated = alt.length > MAX_ARIA_LABEL_LENGTH ? `${alt.slice(0, MAX_ARIA_LABEL_LENGTH)}...` : alt;
      selector += `[alt="${truncated}"]`;
    }
  }
  return selector;
}
function isDescriptive(selector, tag) {
  if (!selector) {
    return false;
  }
  return selector !== tag || !GENERIC_TAGS.has(tag);
}
function buildAncestorPrefix(el) {
  var _el$tagName2, _el$tagName2$toLowerC;
  const tag = (_el$tagName2 = el.tagName) === null || _el$tagName2 === void 0 || (_el$tagName2$toLowerC = _el$tagName2.toLowerCase) === null || _el$tagName2$toLowerC === void 0 ? void 0 : _el$tagName2$toLowerC.call(_el$tagName2);
  if (!tag) {
    return '';
  }
  let prefix = tag;
  if (el.id) {
    prefix += `#${el.id}`;
  }
  const testId = getAttr(el, 'data-test-id');
  if (testId) {
    prefix += `[data-test-id="${testId}"]`;
  }
  const idMarker = getAttr(el, 'data-id-marker');
  if (idMarker) {
    prefix += `[data-id-marker="${idMarker}"]`;
  }
  if (!testId && !idMarker) {
    const classNames = getAttr(el, 'class');
    if (classNames.trim()) {
      prefix += `.${classNames.trim().split(/\s+/)[0]}`;
    }
  }
  return prefix;
}
export function getElementSelector(node) {
  if (!node || !('tagName' in node)) {
    return '';
  }
  const el = node;
  const selfSelector = buildSelfSelector(el);
  let ancestorPart = '';
  let current = el.parentElement;
  let depth = 0;
  while (current && depth < MAX_ANCESTOR_DEPTH) {
    var _current$tagName$toLo, _current$tagName, _current$tagName$toLo2, _current$tagName2;
    depth++;
    const ancestorPrefix = buildAncestorPrefix(current);
    const ancestorTag = (_current$tagName$toLo = (_current$tagName = current.tagName) === null || _current$tagName === void 0 || (_current$tagName$toLo2 = (_current$tagName2 = _current$tagName).toLowerCase) === null || _current$tagName$toLo2 === void 0 ? void 0 : _current$tagName$toLo2.call(_current$tagName2)) !== null && _current$tagName$toLo !== void 0 ? _current$tagName$toLo : '';
    if (isDescriptive(ancestorPrefix, ancestorTag)) {
      const separator = depth === 1 ? ' > ' : ' .. ';
      ancestorPart = ancestorPrefix + separator;
      break;
    }
    current = current.parentElement;
  }
  return ancestorPart + selfSelector;
}
export function getNearestComponentName(node) {
  if (!node) {
    return '';
  }
  let current = 'tagName' in node ? node : node.parentElement;
  let depth = 0;
  while (current && depth < MAX_COMPONENT_NAME_DEPTH) {
    const name = current.getAttribute('data-component-name');
    if (name) {
      return name;
    }
    current = current.parentElement;
    depth++;
  }
  return '';
}