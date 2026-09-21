'use es6';

import getIn from 'transmute/getIn';
import {
    CLIENT_TYPE,
    ID,
    RICH_TEXT,
    SENDER,
    STATUS,
    TEXT,
    TIMESTAMP
} from '../constants/keyPaths';
export const getClientType = getIn(CLIENT_TYPE);
export const getId = getIn(ID);
export const getRichText = getIn(RICH_TEXT);
export const getSender = getIn(SENDER);
export const getStatus = getIn(STATUS);
export const getText = getIn(TEXT);
export const getTimestamp = getIn(TIMESTAMP);