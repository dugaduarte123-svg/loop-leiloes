/* eslint-disable */
'use es6';

const seperator = '\\.';
const blacklistedDomainChars = `\\s\\?\\#\\/\\(\\)\\=\\:\\;\\@\\\\\"${seperator}`;
const protocol = '(?:(?:https?:)?\\/\\/)';
const protocolRequired = '(?:https?:\\/\\/)';
const www = `(?:www${seperator})`;
const domain = `${www}?(?:(?:[^${blacklistedDomainChars}]+)${seperator})+(?:[^${blacklistedDomainChars}]+)`;
const path = '(?:(?:\\/[^\\s\\/\\#\\&\\?]*)+\\/?)';
const wildcardPath = '(?:(/(?:[%a-zA-Z0-9_-])*?)*(?:/[\\*]))';
const fileName = '(?:[%a-zA-Z0-9_-]+)';
const fileExtension = '(?:(?:\\.[%a-zA-Z0-9-]+)[^\\.\\s])';
const file = `${fileName}${fileExtension}`;
const invalidSearchChars = '\\s\\?\\#\\&';
const search = `(?:([\\?&#][^${invalidSearchChars}]*?=?([^${invalidSearchChars}]*))+)`;
const ungroupedSearch = `(?:(?:[\\?&#][^${invalidSearchChars}]*?=?(?:[^${invalidSearchChars}]*))+)`;
export default {
    www,
    domain,
    protocol,
    protocolRequired,
    path,
    wildcardPath,
    file,
    fileName,
    fileExtension,
    search,
    ungroupedSearch
};