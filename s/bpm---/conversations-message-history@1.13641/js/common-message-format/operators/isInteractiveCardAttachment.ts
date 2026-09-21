import get from 'transmute/get';
import { INTERACTIVE_CARD } from '../constants/attachmentTypes';
export const isInteractiveCardAttachment = attachment => attachment !== null && attachment !== undefined && get('@type')(attachment) === INTERACTIVE_CARD;