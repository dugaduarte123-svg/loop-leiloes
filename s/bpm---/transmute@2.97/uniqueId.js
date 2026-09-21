'use es6';

let nextId = 0;

/**
 * Returns a unique integer string appended to `prefix`.
 *
 * @example
 * uniqueId('test-') === 'test-1';
 * uniqueId('other-') === 'other-2';
 * uniqueId('test-') === 'test-3';
 */
export default function uniqueId(prefix = '') {
    return `${prefix}${nextId++}`;
}