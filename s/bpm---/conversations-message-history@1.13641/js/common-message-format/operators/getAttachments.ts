import getIn from 'transmute/getIn';
import { ATTACHMENTS } from '../constants/keyPaths';
// TODO: Put this back in commonMessageFormatGetters

export const getAttachments = getIn(ATTACHMENTS);