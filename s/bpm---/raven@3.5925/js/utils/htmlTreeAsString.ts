"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = htmlTreeAsString;
const MAX_TRAVERSE_HEIGHT = 5;
const MAX_CLASSES_LENGTH = 60;
const ATTRIBUTE_WHITELIST = ['name', 'title', 'alt', 'data-test-id',
// Matches I18n string keys
'data-key'];

/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 */
function htmlTreeAsString(target) {
  /* eslint no-extra-parens:0*/
  const out = [];
  const separator = ' > ';
  let currentElement = target;
  let height = 0;
  while (currentElement && height < MAX_TRAVERSE_HEIGHT) {
    const nextStr = htmlElementAsString(currentElement);
    if (nextStr === 'html') {
      break;
    }

    // If this is the first element (target) and it's restricted, return immediately
    if (height === 0 && nextStr === '<restricted>') {
      return '<restricted>';
    }

    // Skip restricted elements in parent traversal but include all others
    if (nextStr !== '<restricted>') {
      out.push(nextStr);
    }
    height += 1;

    // Safely access parentNode - can throw SecurityError in cross-origin contexts
    try {
      currentElement = currentElement.parentNode;
    } catch (e) {
      // SecurityError when accessing parentNode, stop traversal
      break;
    }
  }
  return out.reverse().join(separator);
}

/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 */
function htmlElementAsString(element) {
  const out = [];
  if (!element) {
    return '';
  }

  // Safely access tagName - can throw SecurityError in cross-origin contexts
  try {
    if (!element.tagName) {
      return '';
    }
    out.push(element.tagName.toLowerCase());
  } catch (e) {
    // SecurityError when accessing cross-origin element properties
    return '<restricted>';
  }

  // Safely access element id
  try {
    if (element.id) {
      out.push(`#${element.id}`);
    }
  } catch (e) {
    // Ignore SecurityError for id access
  }

  // Safely access element attributes
  for (const attribute of ATTRIBUTE_WHITELIST) {
    try {
      const value = element.getAttribute(attribute);
      if (value) {
        out.push(`[${attribute}="${value}"]`);
      }
    } catch (e) {
      // Ignore SecurityError for attribute access
    }
  }
  let classesLength = 0;

  // Safely access element classList
  try {
    // First check if classList is accessible before iterating
    // This prevents SecurityError in Firefox when accessing cross-origin iframes
    if (element.classList && element.classList.length !== undefined) {
      for (const className of element.classList) {
        // Filter out UIComponents private classes
        if (className.startsWith('private-')) {
          continue;
        }
        if (classesLength + className.length > MAX_CLASSES_LENGTH) {
          break;
        }
        classesLength += className.length;
        out.push(`.${className}`);
      }
    }
  } catch (e) {
    // Ignore SecurityError for classList access
  }
  return out.join('');
}
module.exports = exports.default;