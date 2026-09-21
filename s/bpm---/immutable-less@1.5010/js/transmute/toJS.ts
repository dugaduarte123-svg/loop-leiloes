import toJS from 'transmute/toJS';

// this is a list of native JS data structures that do not
// require any conversion
// Do not put `object` in this or doom will happen
// identifies all of the properties that are not optional
// { a: boolean; b?: number; c: string; }
// return 'a' | 'c'
// identifies all of the properties that are optional
// { a: boolean; b?: number; c: string; }
// return 'b'
// doing this to ensure that the any option properties provided by the original
// data structure are kept optional and any required properties are kept required
export default toJS;