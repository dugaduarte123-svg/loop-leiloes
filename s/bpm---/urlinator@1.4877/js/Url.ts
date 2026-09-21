/* hs-eslint ignored failing-rules */
/* eslint-disable prefer-const */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-template */
/* eslint-disable no-empty */

import Env from 'enviro';
import domains from './domains';
const isBoolean = value => typeof value === 'boolean' || value != null && value.valueOf && typeof value.valueOf() === 'boolean';
class Url {
  constructor(url, overrides, filler) {
    this._paramIndex = {};
    this._lonelyQMark = false;
    this.encodedParamTuples = [];
    if (url !== null && typeof url === 'object' && !(url instanceof Url)) {
      if (url === window.location) {
        filler = filler || {};
        filler.protocol = url.protocol.slice(0, -1);
        filler.hostname = url.hostname;
        filler.pathname = url.pathname;
        filler.search = url.search;
        filler.hash = url.hash;
      } else {
        filler = url;
      }
    } else {
      filler = filler || {};
      filler.url = url;
    }
    if (filler.url instanceof Url) {
      this._cloneFrom(filler.url);
      this.upsertParams(filler.params || {});
    } else {
      filler.protocol = filler.protocol || window.location.protocol.slice(0, -1);
      this._set(filler, overrides);
    }
    this.update(overrides);
  }
  _set(opts = {}, skips = {}) {
    let url = opts.url || '';
    let indexHash = url.indexOf('#');
    if (!skips.hash) {
      this.hash = indexHash >= 0 ? url.substr(indexHash) : opts.hash || '';
    }
    url = indexHash >= 0 ? url.substr(0, indexHash) : url;
    let i = url.indexOf('?');
    if (!skips.params && !skips.search) {
      this.search = i >= 0 ? url.substr(i) : opts.search || '';
      this.upsertParams(opts.params || {});
    }
    url = i >= 0 ? url.substr(0, i) : url;
    i = url.indexOf('//');
    if (i > 0 && url[i - 1] != ':') {
      // to differentiate between protocol/domain boundary and domain/path boundary (with missing segment)
      i = -1;
    }
    if (!skips.protocol) {
      this.protocol = i > 0 ? url.substr(0, i - 1) : opts.protocol;
    }
    let j = i < 0 ? 0 : i + 2;
    let k = url.indexOf('/', j);
    if (skips.pathname === undefined) {
      this.pathname = (k < 0 ? '' : url.substr(k)) || opts.pathname || '';
    }
    if (skips.hostname === undefined) {
      let hostname = (k < 0 ? url.substr(j) : url.substr(j, k - j)) || opts.hostname;
      if (hostname) {
        this._lb = opts.lb;
        this.hostname = hostname;
      } else if (opts.lb) {
        this.setLb(opts.lb, opts);
      }
    }
  }
  update(opts = {}) {
    if (opts.protocol) {
      this.protocol = opts.protocol;
    }
    if (opts.hostname !== undefined) {
      this.hostname = opts.hostname;
    }
    if (opts.pathname !== undefined) {
      this.pathname = opts.pathname;
    }
    if (opts.hash !== undefined) {
      this.hash = opts.hash;
    }
    if (opts.lb || opts.production !== undefined || opts.local !== undefined) {
      let o = {
        production: opts.production !== undefined ? opts.production : this.production,
        local: opts.local !== undefined ? opts.local : this.local
      };
      this.setLb(opts.lb || this._lb, o);
    }
    if (opts.search) {
      this.search = opts.search;
    } else if (opts.params) {
      this.params = opts.params;
    } else if (opts.paramTuples) {
      this.paramTuples = opts.paramTuples;
    } else if (opts.encodedParamTuples) {
      this._lonelyQMark = false;
      this.encodedParamTuples = opts.encodedParamTuples.slice(0);
      this._rebuildParamInfo();
    }
  }
  setLb(lb, options = {}) {
    let service = this.segments[0];
    let production = this._getProduction(options.production, service);
    let local = this._getLocal(options.local, service);
    this._hostname = domains.getDomain(lb, production, local);
    this._lb = this._hostname && lb;
    this._production = this._hostname && production;
    this._local = this._hostname && local;
  }
  get href() {
    return this.protocol + '://' + (this.hostname || '') + this.pathname + this.search + this.hash;
  }
  set href(value) {
    this._set({
      url: value
    });
  }
  get search() {
    let s = this.encodedParamTuples.map(tuple => tuple.join('=')).join('&');
    return s.length > 0 || this._lonelyQMark ? '?' + s : s;
  }
  set search(value) {
    this.encodedParamTuples = [];
    this._lonelyQMark = false;
    if (value.length > 1) {
      value.substr(1).split('&').forEach(s => this.encodedParamTuples.push(s.split('=')));
    } else if (value[0] === '?') {
      this._lonelyQMark = true;
    }
    this._rebuildParamInfo();
  }
  normalize() {
    this._lonelyQMark = false;
  }
  set hostname(value) {
    this._hostname = value;
    let info = domains.getLbInfo(value, this._lb);
    this._lb = info && info.lb;
    this._production = info && info.production;
    this._local = info && info.local;
  }
  get hostname() {
    return this._hostname;
  }
  get lb() {
    return this._lb;
  }
  set lb(value) {
    this.setLb(value);
  }
  get production() {
    return this._production;
  }
  set production(value) {
    if (this._lb) {
      this._production = !!value;
      this._hostname = domains.getDomain(this._lb, this._production, this._local);
    }
  }
  get local() {
    return this._local;
  }
  set local(value) {
    if (this._lb) {
      this._local = !!value;
      this._hostname = domains.getDomain(this._lb, this._production, this._local);
    }
  }
  get env() {
    return this._production === undefined ? 'unknown' : this._production ? 'prod' : 'qa';
  }
  get lbInfo() {
    return {
      lb: this._lb,
      production: this._production,
      local: this._local
    };
  }
  get segments() {
    let trimmed = this.pathname.replace(/(^\/)|\/$/g, '');
    return (trimmed ? trimmed.split('/') : []).map(s => decodeURIComponent(s));
  }
  _rebuildParamInfo() {
    this._paramIndex = {};
    this.validParams = true;
    this.encodedParamTuples.forEach((tuple, i) => {
      this.validParams = this.validParams && tuple.length == 2;
      let decodedKey = decodeURIComponent(tuple[0]);
      if (this._paramIndex[decodedKey]) {
        this._paramIndex[decodedKey].push(i);
      } else {
        this._paramIndex[decodedKey] = [i];
      }
    });
  }
  get paramTuples() {
    return this.encodedParamTuples.map(tuple => [decodeURIComponent(tuple[0]), decodeURIComponent(tuple[1])]);
  }
  set paramTuples(tuples) {
    this.encodedParamTuples = [];
    this._lonelyQMark = false;
    tuples.forEach(t => this.encodedParamTuples.push([t[0], t[1]]));
    this._rebuildParamInfo();
  }
  get params() {
    const hash = {};
    Object.keys(this._paramIndex).forEach(key => hash[key] = this.paramValue(key));
    return hash;
  }
  set params(hash) {
    this.encodedParamTuples = [];
    this._lonelyQMark = false;
    Object.keys(hash).forEach(k => this.encodedParamTuples.push([k, encodeURIComponent(hash[k])]));
    this._rebuildParamInfo();
  }
  paramValues(key) {
    return (this._paramIndex[key] || []).map(v => decodeURIComponent(this.encodedParamTuples[v][1]));
  }
  paramValue(key) {
    let arr = this.paramValues(key);
    return arr[arr.length - 1];
  }
  encodedParamValues(key) {
    return (this._paramIndex[decodeURIComponent(key)] || []).map(v => this.encodedParamTuples[v][1]);
  }
  encodedParamValue(key) {
    let arr = this.encodedParamValues(key);
    return arr[arr.length - 1];
  }
  insertParamAt(pos, key, value) {
    this.insertEncodedParamAt(pos, encodeURIComponent(key), encodeURIComponent(value));
  }
  insertEncodedParamAt(pos, key, value) {
    this.encodedParamTuples.splice(pos, 0, [key, value]);
    this._rebuildParamInfo();
  }
  pushParam(key, value) {
    this.insertParamAt(this.encodedParamTuples.length, key, value);
  }
  pushEncodedParam(key, value) {
    this.insertEncodedParamAt(this.encodedParamTuples.length, key, value);
  }
  upsertParam(key, value) {
    let arr = this._paramIndex[key] || [];
    if (arr.length > 0) {
      arr.forEach(i => this.updateParamAt(i, key, value));
    } else {
      this.pushParam(key, value);
    }
  }
  upsertParams(params) {
    Object.keys(params).forEach(key => this.upsertParam(key, params[key]));
  }
  updateParamAt(pos, key, value) {
    this.updateEncodedParamAt(pos, encodeURIComponent(key), encodeURIComponent(value));
  }
  updateEncodedParamAt(pos, key, value) {
    this.encodedParamTuples.splice(pos, 1, [key, value]);
    this._rebuildParamInfo();
  }
  removeParam(key) {
    let arr = this._paramIndex[key] || [];
    if (arr.length > 0) {
      arr.reverse().forEach(i => this.encodedParamTuples.splice(i, 1));
      this._rebuildParamInfo();
    }
  }
  removeParamAt(pos) {
    this.encodedParamTuples.splice(pos, 1);
    this._rebuildParamInfo();
  }
  clearParams() {
    this.encodedParamTuples = [];
    this.validParams = true;
    this._paramIndex = {};
    this._lonelyQMark = false;
  }
  get valid() {
    return !!(this.protocol && this._hostname && (this.pathname || this.pathname === '') && this.validParams);
  }
  get hostplus() {
    return (this.hostname || '') + this.pathname + this.search + this.hash;
  }
  get pathplus() {
    return this.pathname + this.search + this.hash;
  }
  clone() {
    return new Url(this);
  }
  _cloneFrom(url) {
    this.protocol = url.protocol;
    this._hostname = url._hostname;
    this._lb = url._lb;
    this._production = url._production;
    this._local = url._local;
    this.pathname = url.pathname;
    this.hash = url.hash;
    this.encodedParamTuples = url.encodedParamTuples.slice(0);
    this.validParams = url.validParams;
    this._paramIndex = {};
    Object.keys(url._paramIndex).forEach(k => {
      this._paramIndex[k] = url._paramIndex[k].slice(0);
    });
    this._lonelyQMark = url._lonelyQMark;
    return this;
  }
  _getProduction(value, service) {
    if (isBoolean(value)) {
      return value;
    }
    if (isBoolean(this._production)) {
      return this._production;
    }
    return Env.get(service) == 'production';
  }
  _getLocal(value, service) {
    if (isBoolean(value)) {
      return value;
    }
    if (isBoolean(this._local)) {
      return this._local;
    }
    if (service) {
      if (Env.get(service) == 'local') {
        return true;
      }
      return Url.localService(service);
    }
    return false;
  }
  static localService(service) {
    try {
      if (window.localStorage) {
        let key = `${service.toUpperCase()}_LOCAL`;
        return window.localStorage.getItem(key) == 'true';
      }
    } catch (e) {}
    return false;
  }
}
Url.loaded = new Url(window.location);
export default Url;